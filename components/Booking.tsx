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

  // Auto-select time when date changes
  useEffect(() => {
    if (selectedDate && availableTimes.length > 0) {
      // Auto-select the first available time when a date is selected
      setSelectedTime(availableTimes[0]);
    } else if (!selectedDate) {
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
    <section id="booking" className="py-12 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary lg:bg-primary rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Panel - Info - Hidden on mobile */}
          <div className="hidden lg:flex p-10 lg:p-16 lg:w-1/3 flex-col justify-between text-white relative overflow-hidden">
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
          <div className="lg:w-2/3 bg-gray-50 lg:bg-gray-50 bg-white lg:p-12 p-0">
            <div className="bg-white rounded-[2.5rem] lg:rounded-2xl shadow-sm lg:border border-gray-100 lg:p-6 p-0 flex flex-col min-h-[600px] sm:min-h-[700px] max-h-[900px] lg:h-auto lg:max-h-none max-w-[480px] lg:max-w-none mx-auto lg:mx-0 w-full relative overflow-y-auto lg:overflow-hidden">
              
              {/* Mobile Header */}
              <div className="lg:hidden pt-8 pb-4 px-8 flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Elige una fecha</span>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-2xl font-extrabold text-primary">
                      {currentMonth.toLocaleString('es-AR', { month: 'long', year: 'numeric' })}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="size-10 rounded-full bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                  </button>
                  <button onClick={nextMonth} className="size-10 rounded-full bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>
                </div>
              </div>
              
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                  {currentMonth.toLocaleString('es-AR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 px-6 lg:px-0 mb-2 lg:mb-4 text-center flex-shrink-0">
                {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map((day, idx) => (
                  <span 
                    key={day} 
                    className={`text-xs font-bold uppercase py-2 ${
                      idx >= 5 ? 'text-accent-pink lg:text-gray-400' : 'text-gray-400'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>

              {/* Calendar Grid */}
              <div 
                className="calendar-grid grid grid-cols-7 gap-y-2 gap-x-2 lg:gap-y-2 lg:gap-x-4 px-6 py-3 lg:px-0 mb-6 lg:mb-8 overflow-y-auto lg:overflow-visible scrollbar-hide lg:scrollbar-default flex-1 min-h-0"
              >
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
                        <button
                          key={idx} 
                          disabled
                          className={`
                            aspect-square rounded-full lg:rounded-xl
                            bg-gray-50 flex flex-col items-center justify-center relative cursor-not-allowed 
                            text-gray-300
                            ${isFull 
                              ? 'border-2 lg:border border-red-300 lg:border-gray-100' 
                              : 'border border-gray-100'}
                          `}
                        >
                          <span className="text-base font-medium lg:text-xs lg:font-bold text-gray-300">{item.date}</span>
                        </button>
                      );
                    }

                    return (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedDate(item.date)}
                        className={`
                          aspect-square rounded-full lg:rounded-xl flex flex-col items-center justify-center 
                          transition-all group relative overflow-hidden
                          ${isSelected 
                            ? 'bg-primary text-white shadow-lg shadow-primary/40 lg:shadow-lg lg:shadow-primary/30 transform scale-105 lg:scale-105' 
                            : item.urgent
                            ? 'bg-white text-primary border-2 border-accent-yellow/30 lg:border lg:border-gray-200 hover:bg-gray-50 lg:hover:border-primary lg:hover:text-primary'
                            : 'bg-white border-2 border-green-300 lg:border lg:border-gray-200 hover:bg-gray-50 lg:hover:border-primary lg:hover:text-primary text-gray-700'}
                        `}
                      >
                        {item.urgent && !isSelected && (
                          <>
                            <div className="absolute inset-0 rounded-full lg:hidden shadow-[0_0_15px_rgba(254,213,31,0.6)] bg-accent-yellow/5 pointer-events-none"></div>
                          </>
                        )}
                        
                        <span className={`text-base font-medium lg:text-xs lg:font-bold leading-tight relative z-10 ${isSelected ? 'font-bold' : item.urgent ? 'text-primary font-bold' : ''}`}>
                          {item.date}
                        </span>
                        
                        {item.urgent && !isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow mt-1 relative z-10"></div>
                        )}
                        
                        {!item.urgent && !isSelected && (
                          <span className={`
                            text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded-full mt-1 sm:mt-1.5 leading-tight text-center hidden lg:block
                            bg-green-50 text-green-600 font-medium
                          `}>
                            {item.label}
                          </span>
                        )}
                        
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white mt-1 relative z-10"></div>
                        )}
                      </button>
                    );
                  })
                )
              }
              </div>

              {/* Time Selection - Desktop */}
              <div className="border-t border-gray-100 pt-6 px-6 lg:px-0 hidden lg:block">
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
              
              {/* Mobile: Simplified time display - Relative position below calendar */}
              <div className="lg:hidden border-t border-gray-100 pt-6 px-8 pb-4 flex-shrink-0">
                {selectedDate && availableTimes.length > 0 && (() => {
                  const selectedItem = dates.find(d => d.date === selectedDate);
                  return (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' }).toUpperCase()}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-primary">
                          Disponible
                        </h3>
                        {selectedItem?.urgent && (
                          <div className="bg-accent-pink/10 text-accent-pink px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">local_fire_department</span>
                            ¡Se agota!
                          </div>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{availableTimes[0]}</p>
                    </div>
                  );
                })()}
                {selectedDate && availableTimes.length === 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-red-400 italic font-medium">Este día no tenemos talleres programados o ya están llenos.</p>
                  </div>
                )}
              </div>

              {/* Mobile: Bottom sheet style button */}
              <div className={`lg:hidden mt-auto pt-4 px-8 pb-6 flex-shrink-0 ${selectedDate && availableTimes.length > 0 ? '' : 'border-t border-gray-100'}`}>
                {(!selectedDate || availableTimes.length === 0) && (
                  <div className="w-full flex justify-center mb-4 cursor-pointer">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                  </div>
                )}
                <button 
                  onClick={handleConfirmReservation}
                  disabled={!selectedDate || !selectedTime}
                  className={`w-full h-14 font-bold rounded-xl shadow-lg transition-all text-sm uppercase tracking-wide active:scale-95 flex items-center justify-center
                    ${(!selectedDate || !selectedTime) 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-accent-yellow text-primary shadow-accent-yellow/30 hover:shadow-accent-yellow/40 hover:-translate-y-0.5'}`}
                >
                  {(!selectedDate || !selectedTime) ? 'Seleccioná fecha y horario' : 'CONFIRMAR'}
                </button>
              </div>
              
              {/* Desktop: Regular button */}
              <button 
                onClick={handleConfirmReservation}
                disabled={!selectedDate || !selectedTime}
                className={`hidden lg:block w-full mt-8 h-12 font-bold rounded-xl shadow-lg transition-all text-sm uppercase tracking-wide active:scale-95 flex items-center justify-center
                  ${(!selectedDate || !selectedTime) 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-accent-yellow text-primary shadow-accent-yellow/30 hover:shadow-accent-yellow/40 hover:-translate-y-0.5'}`}
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
