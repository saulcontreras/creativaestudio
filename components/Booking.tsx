import React, { useState, useEffect } from 'react';
import { GOOGLE_CALENDAR_API_KEY, GOOGLE_CALENDAR_ID } from '../google_config';

interface CalendarEvent {
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  summary: string;
  description?: string;
}

interface DateSlot {
  day: string;
  date: number | null;
  status: 'empty' | 'available' | 'full' | 'no-workshop' | 'selected';
  label: string;
  urgent: boolean;
  fullDate: Date | null;
}

// Helper to detect if an event indicates it's full
const checkIfFull = (event: any) => {
  const summary = (event.summary || '').toLowerCase();
  const description = (event.description || '').toLowerCase();
  return summary.includes('lleno') || 
         summary.includes('completo') || 
         description.includes('lleno') || 
         description.includes('completo');
};

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper to format time range from ISO strings
  const formatTimeRange = (startStr?: string, endStr?: string) => {
    if (!startStr || !endStr) return null;
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };

    return `${start.toLocaleTimeString('en-US', options)} - ${end.toLocaleTimeString('en-US', options)}`;
  };

  // Get available times for the selected date
  const getAvailableTimesForDate = (dayNumber: number | null) => {
    if (!dayNumber) return [];
    
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(dayNumber).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    return events
      .filter(e => {
        const startStr = e.start?.dateTime || e.start?.date;
        if (!startStr) return false;
        
        const eventDate = new Date(startStr);
        const isSameDay = eventDate.getFullYear() === year && 
                          eventDate.getMonth() === currentMonth.getMonth() && 
                          eventDate.getDate() === dayNumber;
                          
        const isNotFull = !checkIfFull(e);
        return isSameDay && isNotFull;
      })
      .map(e => formatTimeRange(e.start?.dateTime, e.end?.dateTime))
      .filter((t): t is string => t !== null);
  };

  const availableTimes = getAvailableTimesForDate(selectedDate);

  // Auto-select time if there's only one
  useEffect(() => {
    if (availableTimes.length === 1) {
      setSelectedTime(availableTimes[0]);
    } else {
      setSelectedTime(null);
    }
  }, [selectedDate, events]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch from the start of today to ensure we don't miss today's events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timeMin = today.toISOString();
        
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&t=${new Date().getTime()}`
        );
        const data = await response.json();
        if (data.items) {
          console.log('Eventos cargados:', data.items);
          setEvents(data.items);
        }
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Generate calendar days for the current month
  const generateCalendarDays = (): DateSlot[] => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Day of week for the 1st (0=Sun, 1=Mon... so we adjust to Mon=0)
    let startDay = startOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Adjust to Monday start

    const days: DateSlot[] = [];

    // Empty slots before the 1st
    for (let i = 0; i < startDay; i++) {
      days.push({ day: '', date: null, status: 'empty', label: '', urgent: false, fullDate: null });
    }

    // Days of the month
    for (let d = 1; d <= endOfMonth.getDate(); d++) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const fullDate = new Date(year, month, d);
      
      // Formatting date for comparison (YYYY-MM-DD)
      const yearStr = year;
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateString = `${yearStr}-${monthStr}-${dayStr}`;
      
      // Check if this date has any "Lleno" events or is busy
      const dayEvents = events.filter(e => {
        const startStr = e.start?.dateTime || e.start?.date;
        if (!startStr) return false;
        
        const eventDate = new Date(startStr);
        return eventDate.getFullYear() === year && 
               eventDate.getMonth() === month && 
               eventDate.getDate() === d;
      });

      const isFull = dayEvents.some(e => checkIfFull(e));
      
      const hasEvents = dayEvents.length > 0;
      const isUrgent = dayEvents.some(e => 
        e.description && typeof e.description === 'string' && 
        (e.description.toLowerCase().includes('pocos') || e.description.toLowerCase().includes('últimos'))
      );
      
      let status: 'available' | 'full' | 'no-workshop' = 'available';
      let label = '¡Cupos!';
      let urgent = false;

      if (!hasEvents) {
        status = 'no-workshop';
        label = 'Sin taller';
      } else if (isFull) {
        status = 'full';
        label = 'Lleno';
      } else {
        status = 'available';
        if (isUrgent) {
          label = '¡Últimos!';
          urgent = true;
        } else {
          label = '¡Quedan cupos!';
        }
      }

      days.push({
        day: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'][fullDate.getDay() === 0 ? 6 : fullDate.getDay() - 1],
        date: d,
        status: status,
        label: label,
        urgent: urgent,
        fullDate: fullDate
      });
    }

    return days;
  };

  const dates = generateCalendarDays();

  const handleConfirmReservation = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor seleccioná un día y un horario.');
      return;
    }

    const monthName = currentMonth.toLocaleString('es-AR', { month: 'long' });
    const message = `¡Hola! Quiero reservar para el taller del día ${selectedDate} de ${monthName} en el horario de ${selectedTime}.`;
    const whatsappUrl = `https://wa.me/543513546513?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  return (
    <section id="booking" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Panel - Info */}
          <div className="p-10 lg:p-16 lg:w-1/3 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-pink rounded-full blur-[80px] opacity-40 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">¡Asegurá tu lugar!</h2>
              <p className="text-white/80 mb-8 font-body leading-relaxed">
                ¡Elegí el día que más te guste y vení a divertirte! Los cupos son poquitos para que todos podamos pintar cómodos.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent-yellow">timer</span>
                  </div>
                  <div>
                    <p className="font-bold">Hora y media de juego</p>
                    <p className="text-sm text-white/70">Pura creatividad</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent-yellow">shopping_bag</span>
                  </div>
                  <div>
                    <p className="font-bold">¡Todo incluido!</p>
                    <p className="text-sm text-white/70">Yesos, pinturas, pinceles y merienda</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 relative z-10">
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-sm font-medium mb-2">¿Tenés alguna duda?</p>
                <a 
                  href="https://wa.me/543513546513" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full block text-center py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-gray-100 transition-colors"
                >
                  ¡Escribinos por WhatsApp!
                </a>
              </div>
            </div>
          </div>

          {/* Right Panel - Calendar Widget */}
          <div className="lg:w-2/3 bg-gray-50 p-8 lg:p-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                  {currentMonth.toLocaleString('es-AR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 mb-4 text-center">
                {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map(day => (
                  <span key={day} className="text-xs font-bold text-gray-400 uppercase">{day}</span>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-8">
                {loading ? (
                  <div className="col-span-7 py-10 text-center text-gray-400 font-medium">Cargando fechas...</div>
                ) : (
                  dates.map((item, idx) => {
                    if (item.status === 'empty') return <div key={idx} className="aspect-square"></div>;
                    
                    const isSelected = selectedDate === item.date;
                    const isFull = item.status === 'full';
                    const isNoWorkshop = item.status === 'no-workshop';
                    
                    if (isFull || isNoWorkshop) {
                      return (
                        <div key={idx} className="aspect-square rounded-xl bg-gray-50 flex flex-col items-center justify-center relative cursor-not-allowed opacity-60 border border-gray-100">
                          <span className="text-sm font-bold text-gray-400">{item.date}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full mt-1 ${isFull ? 'bg-red-50 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
                            {item.label}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedDate(item.date)}
                        className={`
                          aspect-square rounded-xl flex flex-col items-center justify-center transition-all group relative overflow-hidden
                          ${isSelected 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105' 
                            : 'bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-700'}
                        `}
                      >
                        {item.urgent && !isSelected && (
                           <div className="absolute top-0 right-0 w-3 h-3 bg-accent-yellow rounded-bl-full"></div>
                        )}
                        
                        <span className="text-sm font-bold">{item.date}</span>
                        
                        <span className={`
                          text-[9px] px-1.5 py-0.5 rounded-full mt-1
                          ${isSelected ? 'bg-white/20' : (item.urgent ? 'bg-yellow-50 text-yellow-700 font-bold' : 'bg-green-50 text-green-600 font-medium')}
                        `}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })
                )
              }
              </div>

              {/* Time Selection */}
              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Horario para jugar ({selectedDate ? `${selectedDate} de ${currentMonth.toLocaleString('es-AR', { month: 'short' })}` : 'Seleccionar fecha'})
                </p>
                <div className="flex flex-wrap gap-3">
                  {selectedDate ? (
                    availableTimes.length > 0 ? (
                      availableTimes.map((timeRange) => (
                        <button 
                            key={timeRange}
                            onClick={() => setSelectedTime(timeRange)}
                            className={`
                              px-4 py-2 rounded-lg text-sm transition-colors font-bold
                              ${selectedTime === timeRange 
                                ? 'bg-primary text-white shadow-md' 
                                : 'border border-gray-200 text-gray-500 hover:border-primary hover:text-primary font-medium'}
                            `}
                          >
                          {timeRange}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-red-400 italic font-medium">Este día no tenemos talleres programados o ya están llenos.</p>
                    )
                  ) : (
                    <p className="text-sm text-gray-400 italic">Seleccioná un día disponible en el calendario para ver el horario.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={handleConfirmReservation}
                disabled={!selectedDate || !selectedTime}
                className={`w-full mt-8 h-12 font-bold rounded-xl shadow-md transition-all text-sm uppercase tracking-wide active:scale-95
                  ${(!selectedDate || !selectedTime) 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-accent-yellow text-primary hover:shadow-lg'}`}
              >
                {(!selectedDate || !selectedTime) ? 'Seleccioná fecha y horario' : 'CONFIRMAR RESERVA'}
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
