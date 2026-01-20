import React from 'react';

export default function Gallery() {
  const images = [
    {
      url: "/Recursos/Tallaeres/file_0000000005e0720e814775645e46a179.png",
      alt: "Taller creativo 1"
    },
    {
      url: "/Recursos/Tallaeres/file_00000000859c71f584d21a7c25312572 (1).png",
      alt: "Taller creativo 2"
    },
    {
      url: "/Recursos/Tallaeres/InShot_20260119_205255811.jpg",
      alt: "Taller creativo 3"
    }
  ];

  return (
    <section id="gallery" className="py-24 bg-background-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">¡Momentos a todo color!</h2>
          <p className="text-gray-600">Así de bien la pasamos en nuestro rinconcito creativo</p>
        </div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-20">
          {images.map((img, idx) => (
            <div key={idx} className="break-inside-avoid rounded-2xl overflow-hidden shadow-md group relative">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
              <img
                alt={img.alt}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                src={img.url}
              />
            </div>
          ))}
        </div>

        {/* Testimonial - Hidden until real reviews are available
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-4xl mx-auto relative">
          <span className="material-symbols-outlined absolute top-8 left-8 text-accent-pink/20 text-6xl">mood</span>
          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-xl md:text-2xl font-medium text-primary italic mb-8 font-display">
              "¡Es genial! Mi nena sale siempre con una sonrisa gigante y súper orgullosa de sus figuras. Es un espacio donde realmente la dejan ser y crear sin presiones. ¡Nos encanta!"
            </p>
            <div className="flex items-center gap-4">
              <img
                alt="Retrato de una mamá feliz"
                className="w-12 h-12 rounded-full object-cover shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjCrGROopKe1MhXkAubHrklPgIqy_FRa4D-mNuhnOt0jazYG9hsZQshR3rZlFyF9wFe7Yr8UzisvvjBsGyIeOydS2bfh9ONGUm5F4jCBpWa2A2dRxz8NqPPUKmr9ksJJYFSRiH-gjhtlh-gtKSGH8-jbMm-4Lt4aCKBZYR40AUUc00JUHG-X51tMEh9ORi5LnTrJ-BDVdgWrCDPb882fvzViRBTtRFIqtYJEWoz3ATHO9Hfv9PF1wwX5wEnosOFKNpz6556-5Qvni2"
              />
              <div className="text-left">
                <p className="font-bold text-text-dark">Mariana López</p>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Mamá de Sofi (5 años)</p>
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
    </section>
  );
}