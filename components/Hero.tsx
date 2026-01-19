import React from 'react';

export default function Hero() {
  return (
    <section className="relative bg-background-soft overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-pink/10 text-accent-pink w-fit mx-auto lg:mx-0">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span className="text-xs font-bold uppercase tracking-wide">¡PURA MAGIA Y COLOR!</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight">
            ¡Manos a la obra y <span className="text-accent-pink text-shadow">mucha pintura!</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 font-body leading-relaxed">
            ¡Vení a jugar con colores, pinceles y figuras de yeso! En Creativa no hay reglas, solo ganas de ensuciarse las manos y pasar un rato increíble creando cosas únicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button className="h-14 px-8 rounded-xl bg-accent-yellow text-primary text-lg font-bold shadow-lg shadow-accent-yellow/30 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center gap-2 group">
              <span>¡QUIERO PINTAR!</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">rocket_launch</span>
            </button>
            <button className="h-14 px-8 rounded-xl bg-white text-primary border-2 border-primary/10 text-lg font-bold hover:bg-primary/5 transition-all duration-300 flex items-center justify-center">
              Ver qué hacemos
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent-pink/20 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-yellow/30 rounded-full blur-3xl -z-10 -translate-x-10 translate-y-10"></div>
          
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 border-8 border-white">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img
              alt="Niño pintando en Creativa Estudio"
              className="w-full h-[500px] object-cover"
              src="/Recursos/Tallaeres/4594665.jpg"
            />
            
            {/* Testimonial Badge */}
            <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <div className="flex -space-x-3">
                <img
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI6bGJ98zQ39-GaAdvC_UiTjqtcwwjvQ6N3NNrOZ89Wp2ci7Rp_qTZ05OotShKwLDd2pLMw5GA2KF0ajIbuEBeQIwRRcIv-Dq18gB9x5NUqz2NIUKhaaFPsTCh1hA5qKT4QfwfNSJtet5x-5wHnL3ijCnMMVkVfQW4suRlqN9OnnTcCrQ_yEzqDJBUazg9dBoT06D0n9FWZNsHmOrqsbKfyff5m7aaQdPs4YG9mbgRDO6DyE8aOJ_niwEJst_bWX_57ewK9kpx4bAd"
                />
                <img
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOM8rzkpL-wFxQs-AP6F-gkGMy0bkS0vabPyhLwWUG_WHaT1jfxkPkWM55qfspwT5jN3_3_8b4IwIgru7MwH-QQLadAg1uCRMGhdkIBwXB025zuZs6v7X7r4f4QTfpH99ilRAZnFq8Hd9UD8NShHWeN0IKYYs-nn9va15nSUaS8Zfh4hZXGrYJIjX7hVGkVcDGiQiKPXWW36D2U5NU4qhgEqA15k6a3kod-gljBrbpxMLF_-DfsGudEwHg_KS1vO3DqfXwGgSMbIyk"
                />
                <img
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVMZmIh0qJOf5FX1D5Lc8mMKgiNI6M28hSk_K1zWdaeUxXGPCtQdSswcs8vlcyYaztyjdpCElgfq9gqSF9Dmyaw6Qnapz32H2GPYKhSG1_xAgyuvGK7QeTHwg8zwii96GW_cWqxQ5f9_TAOpTmw00Iy65qqRnRy7v6tz_goc8ItfjnE23gXpt7e5fpumY8ODt3fan50lmeckakW1c9jAYIHkCP6sbm6WzfVdrZtmYDIgEGdiLWL7bJJ0tMnru1iXsDt7SaG5rFscOs"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">¡Familias felices!</p>
                <div className="flex items-center gap-1">
                  <span className="text-primary font-bold text-sm">¡Diversión total!</span>
                  <span className="material-symbols-outlined text-accent-yellow text-sm fill-current">favorite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}