import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-lg p-1.5 inline-flex items-center justify-center">
                 <img 
                  src="/Recursos/Logos/isologo 1.png"
                  alt="Creativa Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest">CREATIVA</h2>
            </div>
            <p className="text-white/70 max-w-sm font-body text-sm leading-relaxed">
              Un lugarcito lleno de luz y color para que los chicos se expresen, jueguen con sus manos y se diviertan creando arte.
            </p>
          </div>

          {/* Links 1 - Hidden until content is ready
          <div>
            <h3 className="font-bold mb-4 text-accent-yellow uppercase tracking-wider text-xs">Explorar</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a className="hover:text-white transition-colors" href="#">Talleres</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Cumpleaños</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Nuestras figuras</a></li>
            </ul>
          </div>
          */}

          {/* Links 2 */}
          <div>
            <h3 className="font-bold mb-4 text-accent-yellow uppercase tracking-wider text-xs">Contacto</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">location_on</span>
                Villa del Rosario, Córdoba
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">mail</span>
                estudiocreativa.vdr@gmail.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <p>© 2023 Creativa. ¡Hecho con mucho amor y color!</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a className="hover:text-white transition-colors" href="#">Privacidad</a>
            <a className="hover:text-white transition-colors" href="#">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}