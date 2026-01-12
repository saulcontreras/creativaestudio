/**
 * Creativa Estudio - Landing Page
 * JavaScript para funcionalidades interactivas
 */

// ============================================
// DATOS DE TALLERES - Estructura clara para fácil actualización
// ============================================
const talleres = [
    {
        fecha: '2024-03-15',
        nombre: 'Taller de Pintura sobre Yesos - Primavera',
        descripcion: 'Taller especial de primavera donde aprenderás técnicas de pintura sobre yesos decorativos. Ideal para todas las edades. Incluye todos los materiales.'
    },
    {
        fecha: '2024-03-22',
        nombre: 'Taller para Madres e Hijos',
        descripcion: 'Un espacio especial para compartir en familia. Crearemos hermosas piezas juntos mientras disfrutamos de un momento único de conexión y creatividad.'
    },
    {
        fecha: '2024-04-05',
        nombre: 'Taller de Yesos Temáticos - Pascua',
        descripcion: 'Taller temático de Pascua. Pintaremos yesos con motivos primaverales y de Pascua. Perfecto para decorar tu hogar o regalar.'
    },
    {
        fecha: '2024-04-12',
        nombre: 'Taller Avanzado de Técnicas Mixtas',
        descripcion: 'Para quienes ya tienen experiencia. Exploraremos técnicas avanzadas de pintura, texturas y acabados especiales sobre yesos.'
    }
];

// ============================================
// IMÁGENES DE TALLERES - Ruta relativa desde index.html
// ============================================
const imagenesTalleres = [
    'Recursos/Tallaeres/4594665.jpg',
    'Recursos/Tallaeres/4594666.jpg',
    'Recursos/Tallaeres/4594668.jpg',
    'Recursos/Tallaeres/4594670.jpg',
    'Recursos/Tallaeres/4594671.jpg',
    'Recursos/Tallaeres/4594672.jpg'
];

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Formatea una fecha en formato legible en español
 */
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const opciones = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    
    // Formatear en español
    const fechaFormateada = fecha.toLocaleDateString('es-AR', opciones);
    const partes = fechaFormateada.split(' ');
    
    return {
        dia: partes[0],
        mes: partes[1],
        año: partes[2]
    };
}

/**
 * Obtiene el nombre del mes en español
 */
function obtenerMes(fechaString) {
    const fecha = new Date(fechaString);
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[fecha.getMonth()];
}

// ============================================
// CARGAR GALERÍA DE IMÁGENES
// ============================================
function cargarGaleria() {
    // Si está disponible el sistema de Instagram, usarlo
    if (typeof cargarGaleriaInstagram === 'function') {
        cargarGaleriaInstagram();
        return;
    }
    
    // Fallback: cargar imágenes locales
    const galleryContainer = document.getElementById('gallery');
    
    if (!galleryContainer) return;
    
    imagenesTalleres.forEach((imagenSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);
        
        const img = document.createElement('img');
        img.src = imagenSrc;
        img.alt = `Taller Creativa Estudio ${index + 1}`;
        img.loading = 'lazy'; // Lazy loading para mejor rendimiento
        
        // Manejo de errores de carga de imagen
        img.onerror = function() {
            console.warn(`No se pudo cargar la imagen: ${imagenSrc}`);
            this.style.display = 'none';
        };
        
        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
    });
}

// ============================================
// CARGAR PRÓXIMOS TALLERES
// ============================================
function cargarProximosTalleres() {
    const calendarContainer = document.getElementById('workshops-calendar');
    
    if (!calendarContainer) return;
    
    // Ordenar talleres por fecha
    const talleresOrdenados = [...talleres].sort((a, b) => 
        new Date(a.fecha) - new Date(b.fecha)
    );
    
    if (talleresOrdenados.length === 0) {
        calendarContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--color-text-medium);">
                <p style="font-size: 1.2rem;">Próximamente anunciaremos nuevos talleres.</p>
                <p>¡Seguinos en Instagram para estar al día!</p>
            </div>
        `;
        return;
    }
    
    talleresOrdenados.forEach(taller => {
        const fecha = formatearFecha(taller.fecha);
        const mes = obtenerMes(taller.fecha);
        
        const workshopCard = document.createElement('div');
        workshopCard.className = 'workshop-card';
        
        workshopCard.innerHTML = `
            <div class="workshop-date">
                <div class="workshop-date-day">${fecha.dia}</div>
                <div class="workshop-date-month">${mes}</div>
            </div>
            <div class="workshop-info">
                <h3>${taller.nombre}</h3>
                <p>${taller.descripcion}</p>
            </div>
        `;
        
        calendarContainer.appendChild(workshopCard);
    });
}

// ============================================
// SMOOTH SCROLL PARA ENLACES ANCLA
// ============================================
function inicializarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces vacíos
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// ANIMACIÓN AL HACER SCROLL (Intersection Observer)
// ============================================
function inicializarAnimacionesScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar secciones
    const secciones = document.querySelectorAll('.about, .workshops-gallery, .upcoming-workshops, .contact');
    secciones.forEach(seccion => {
        seccion.style.opacity = '0';
        seccion.style.transform = 'translateY(30px)';
        seccion.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(seccion);
    });
}

// ============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Creativa Estudio - Landing Page cargada');
    
    // Cargar contenido dinámico
    cargarGaleria();
    cargarProximosTalleres();
    
    // Inicializar funcionalidades
    inicializarSmoothScroll();
    inicializarAnimacionesScroll();
    
    // Mensaje de bienvenida en consola (opcional, para desarrollo)
    console.log('✅ Todas las funcionalidades inicializadas correctamente');
});

// ============================================
// EXPORTAR FUNCIONES PARA USO EXTERNO (si es necesario)
// ============================================
// Las funciones están disponibles globalmente para fácil actualización de datos
