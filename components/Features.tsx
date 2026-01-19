import React from 'react';

export default function Features() {
  const features = [
    {
      icon: 'format_paint',
      title: '¡Libertad Total!',
      text: '¡Sin moldes ni reglas! Cada niño elige sus colores favoritos y pinta como más le guste. ¡La imaginación manda!',
      colorClass: 'text-accent-pink',
      bgClass: 'bg-accent-pink/10',
      borderClass: 'hover:border-accent-pink/20',
      blobClass: 'bg-accent-pink/5',
    },
    {
      icon: 'back_hand',
      title: 'Hacer con las manos',
      text: 'Sentir el yeso, mezclar las témperas y ver cómo aparece el color. ¡Es una experiencia súper divertida para los sentidos!',
      colorClass: 'text-primary',
      bgClass: 'bg-primary/10',
      borderClass: 'hover:border-primary/20',
      blobClass: 'bg-primary/5',
    },
    {
      icon: 'emoji_events',
      title: '¡Mi obra maestra!',
      text: 'La alegría de terminar una pieza y decir "¡Esto lo hice yo!". Se llevan su creación a casa para decorar su cuarto.',
      colorClass: 'text-yellow-600',
      bgClass: 'bg-accent-yellow/20',
      borderClass: 'hover:border-accent-yellow/20',
      blobClass: 'bg-accent-yellow/10',
    },
  ];

  return (
    <section id="methodology" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent-pink font-bold tracking-wider uppercase text-sm">¿Por qué venir a Creativa?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">¡Un recreo lleno de color!</h2>
          <p className="text-gray-600 italic">Acá venimos a disfrutar, a reírnos y a crear cosas con nuestras propias manos.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl ${feature.borderClass} transition-all duration-300 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${feature.blobClass} rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}></div>
              <div className={`w-16 h-16 rounded-xl ${feature.bgClass} flex items-center justify-center ${feature.colorClass} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed font-body">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}