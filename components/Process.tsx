import React from 'react';

export default function Process() {
  const steps = [
    {
      step: 'Paso 1',
      icon: 'touch_app',
      title: 'Elegir la pieza',
      desc: '¡Arrancamos la aventura! Mirá todas las figuras de yeso que tenemos: dinosaurios, hadas, cohetes... ¡Elegí tu favorita y llevala a tu mesa!',
      subtitle: '¿Qué encontrás?',
      subdesc: 'Un montón de personajes esperando cobrar vida.',
      color: 'accent-yellow',
      borderColor: 'border-accent-yellow',
      badgeBg: 'bg-accent-yellow/20',
      badgeText: 'text-yellow-800',
      iconColor: 'text-accent-yellow'
    },
    {
      step: 'Paso 2',
      icon: 'palette',
      title: 'Mezclar y jugar',
      desc: '¡Manos a la obra! Agarrá los pinceles y llená todo de color. Mezclá, probá y divertite pintando sin miedo. ¡Acá enchastrarse vale!',
      subtitle: '¿Qué hacemos?',
      subdesc: 'Experimentamos con colores y disfrutamos creando.',
      color: 'accent-pink',
      borderColor: 'border-accent-pink',
      badgeBg: 'bg-accent-pink/10',
      badgeText: 'text-accent-pink',
      iconColor: 'text-accent-pink'
    },
    {
      step: 'Paso 3',
      icon: 'auto_awesome',
      title: 'Toques finales',
      desc: '¡El momento mágico! Dale esos últimos detalles especiales para que quede increíble. ¡Y listo! Ya tenés tu obra de arte para llevar a casa.',
      subtitle: '¿El resultado?',
      subdesc: 'Una creación única hecha 100% por vos con una gran sonrisa.',
      color: 'primary',
      borderColor: 'border-primary',
      badgeBg: 'bg-primary/10',
      badgeText: 'text-primary',
      iconColor: 'text-primary'
    }
  ];

  return (
    <section id="stages" className="py-24 bg-background-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">El viaje creativo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark mt-2">¡Tres pasos para la diversión!</h2>
            <p className="text-gray-600 mt-4">Así convertimos una figura blanca en una obra de arte llena de personalidad.</p>
          </div>
          <div className="hidden md:block">
            <span className="material-symbols-outlined text-primary/20 text-9xl absolute right-10 -mt-24 pointer-events-none">palette</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <div key={index} className={`bg-white rounded-2xl p-6 border-l-8 ${item.borderColor} shadow-md hover:shadow-lg transition-shadow`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`${item.badgeBg} ${item.badgeText} text-xs font-bold px-3 py-1 rounded-full uppercase`}>{item.step}</span>
                <span className={`material-symbols-outlined ${item.iconColor}`}>{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-4 font-body">{item.desc}</p>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{item.subtitle}</p>
                <p className="text-sm text-gray-700 font-medium">{item.subdesc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}