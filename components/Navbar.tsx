import React, { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#ede8f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/Recursos/Logos/isologo 1.png"
              alt="Creativa Logo"
              className="h-12 w-auto object-contain"
            />
            <h1 className="text-primary text-xl font-bold tracking-tight uppercase">CREATIVA</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-text-dark hover:text-primary font-medium transition-colors" href="#methodology">
              A jugar
            </a>
            <a className="text-text-dark hover:text-primary font-medium transition-colors" href="#stages">
              Nuestros rincones
            </a>
            <a className="text-text-dark hover:text-primary font-medium transition-colors" href="#gallery">
              Galería
            </a>
            <a className="text-text-dark hover:text-primary font-medium transition-colors" href="#booking">
              ¡Quiero ir!
            </a>
          </nav>

          {/* CTA Button */}
          <button className="hidden md:flex items-center justify-center h-10 px-6 rounded-xl bg-accent-yellow text-primary text-sm font-bold shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-200">
            ¡RESERVAR MI LUGAR!
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-lg">
           <nav className="flex flex-col gap-4">
            <a 
              className="text-text-dark hover:text-primary font-medium transition-colors" 
              href="#methodology"
              onClick={() => setMobileMenuOpen(false)}
            >
              A jugar
            </a>
            <a 
              className="text-text-dark hover:text-primary font-medium transition-colors" 
              href="#stages"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nuestros rincones
            </a>
            <a 
              className="text-text-dark hover:text-primary font-medium transition-colors" 
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
            >
              Galería
            </a>
            <a 
              className="text-text-dark hover:text-primary font-medium transition-colors" 
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
            >
              ¡Quiero ir!
            </a>
            <button className="w-full h-12 rounded-xl bg-accent-yellow text-primary font-bold shadow-sm">
              ¡RESERVAR MI LUGAR!
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}