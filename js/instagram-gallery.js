/**
 * Creativa Estudio - Integración con Instagram
 * Sistema flexible para obtener imágenes de historias destacadas
 * 
 * OPCIONES DISPONIBLES:
 * 1. Instagram Graph API (requiere cuenta de negocio)
 * 2. Servicios de terceros (EmbedSocial, Elfsight)
 * 3. Actualización manual mejorada
 */

// ============================================
// CONFIGURACIÓN
// ============================================
const INSTAGRAM_CONFIG = {
    // Opción 1: Instagram Graph API
    // Necesitas: Access Token de Instagram Graph API
    useGraphAPI: false, // Cambiar a true cuando tengas el token
    accessToken: '', // Tu token de acceso de Instagram Graph API
    userId: '', // Tu Instagram User ID
    
    // Opción 2: Servicios de terceros
    // EmbedSocial o Elfsight - ver instrucciones más abajo
    useThirdParty: true, // Cambiar a true si usas un servicio de terceros
    serviceType: 'elfsight', // 'embedsocial' o 'elfsight'
    widgetId: '57f84339-7f5a-42ee-80a6-85d678cc7b7f', // ID del widget de Elfsight
    
    // Opción 3: Modo manual (por defecto)
    // Actualiza el array de imágenes manualmente
    useManual: true,
    
    // Fallback: imágenes locales si falla la conexión
    fallbackImages: [
        'Recursos/Tallaeres/4594665.jpg',
        'Recursos/Tallaeres/4594666.jpg',
        'Recursos/Tallaeres/4594668.jpg',
        'Recursos/Tallaeres/4594670.jpg',
        'Recursos/Tallaeres/4594671.jpg',
        'Recursos/Tallaeres/4594672.jpg'
    ]
};

// ============================================
// OPCIÓN 1: INSTAGRAM GRAPH API
// ============================================
/**
 * Obtiene imágenes desde Instagram usando Graph API
 * Requiere: Cuenta de Instagram Business/Creator + Access Token
 */
async function obtenerImagenesGraphAPI() {
    if (!INSTAGRAM_CONFIG.useGraphAPI || !INSTAGRAM_CONFIG.accessToken) {
        return null;
    }
    
    try {
        // Nota: La API de Instagram no expone directamente las historias destacadas
        // Esta función obtiene las publicaciones recientes como alternativa
        const response = await fetch(
            `https://graph.instagram.com/${INSTAGRAM_CONFIG.userId}/media?fields=id,media_type,media_url,permalink&access_token=${INSTAGRAM_CONFIG.accessToken}&limit=12`
        );
        
        if (!response.ok) {
            throw new Error('Error al obtener datos de Instagram');
        }
        
        const data = await response.json();
        
        // Filtrar solo imágenes
        const imagenes = data.data
            .filter(item => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM')
            .map(item => ({
                url: item.media_url,
                link: item.permalink,
                id: item.id
            }));
        
        return imagenes;
    } catch (error) {
        console.error('Error al obtener imágenes de Instagram Graph API:', error);
        return null;
    }
}

// ============================================
// OPCIÓN 2: SERVICIOS DE TERCEROS
// ============================================
/**
 * Carga un widget de terceros (EmbedSocial, Elfsight, etc.)
 * Estos servicios manejan la conexión con Instagram por ti
 */
function cargarWidgetTerceros() {
    if (!INSTAGRAM_CONFIG.useThirdParty) {
        return;
    }
    
    const galleryContainer = document.getElementById('gallery');
    if (!galleryContainer) return;
    
    // OPCIÓN A: EmbedSocial (Recomendado para Historias Destacadas)
    if (INSTAGRAM_CONFIG.serviceType === 'embedsocial') {
        // EmbedSocial te dará un código completo, reemplaza esta sección con ese código
        // Ejemplo de estructura (reemplazar con tu código real):
        const embedSocialCode = `
            <!-- Reemplaza este bloque con el código completo que te da EmbedSocial -->
            <div id="embedsocial-instagram-stories" data-instagram-stories-id="${INSTAGRAM_CONFIG.widgetId}"></div>
            <script>
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "https://embedsocial.com/embed-script.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, "script", "EmbedSocialInstagramStoriesScript"));
            </script>
        `;
        galleryContainer.innerHTML = embedSocialCode;
        return;
    }
    
    // OPCIÓN B: Elfsight (Solo para Feed de Publicaciones, NO Historias Destacadas)
    if (INSTAGRAM_CONFIG.serviceType === 'elfsight') {
        // Elfsight para feed de Instagram (no historias destacadas)
        // El script se carga en el HTML, solo necesitamos el div
        galleryContainer.innerHTML = `<div class="elfsight-app-${INSTAGRAM_CONFIG.widgetId}" data-elfsight-app-lazy></div>`;
        
        // Agregar clase al contenedor para quitar el grid y permitir que Elfsight controle el layout
        galleryContainer.classList.add('elfsight-container');
        
        // Asegurarnos de que el script de Elfsight esté cargado
        if (!document.querySelector('script[src*="elfsightcdn.com"]')) {
            const elfsightScript = document.createElement('script');
            elfsightScript.src = 'https://elfsightcdn.com/platform.js';
            elfsightScript.async = true;
            document.head.appendChild(elfsightScript);
        }
        return;
    }
    
    // Si no se especifica el tipo de servicio, usar EmbedSocial por defecto
    console.warn('No se especificó el tipo de servicio. Usa serviceType: "embedsocial" o "elfsight"');
}

// ============================================
// OPCIÓN 3: MODO MANUAL MEJORADO
// ============================================
/**
 * Carga imágenes desde un array manual
 * Puedes actualizar este array fácilmente
 */
function obtenerImagenesManuales() {
    // Array de URLs de imágenes de Instagram
    // Puedes obtener estas URLs manualmente desde las historias destacadas
    const imagenesManuales = [
        // Ejemplo de formato:
        // 'https://scontent.cdninstagram.com/v/...', // URL directa de imagen de Instagram
        // Agrega aquí las URLs de tus historias destacadas
    ];
    
    // Si hay imágenes manuales, usarlas; si no, usar fallback
    return imagenesManuales.length > 0 ? imagenesManuales : INSTAGRAM_CONFIG.fallbackImages;
}

// ============================================
// FUNCIÓN PRINCIPAL DE CARGA
// ============================================
async function cargarGaleriaInstagram() {
    const galleryContainer = document.getElementById('gallery');
    
    if (!galleryContainer) return;
    
    let imagenes = [];
    
    // Intentar cargar según la configuración
    if (INSTAGRAM_CONFIG.useGraphAPI) {
        const imagenesAPI = await obtenerImagenesGraphAPI();
        if (imagenesAPI && imagenesAPI.length > 0) {
            imagenes = imagenesAPI.map(img => img.url);
        } else {
            // Fallback a imágenes manuales
            imagenes = obtenerImagenesManuales();
        }
    } else if (INSTAGRAM_CONFIG.useThirdParty) {
        // Si usas servicio de terceros, el widget se carga automáticamente
        cargarWidgetTerceros();
        return; // Salir, el widget maneja su propia visualización
    } else {
        // Modo manual
        imagenes = obtenerImagenesManuales();
    }
    
    // Limpiar contenedor
    galleryContainer.innerHTML = '';
    
    // Cargar imágenes
    imagenes.forEach((imagenSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);
        
        const img = document.createElement('img');
        img.src = imagenSrc;
        img.alt = `Taller Creativa Estudio ${index + 1}`;
        img.loading = 'lazy';
        
        // Manejo de errores
        img.onerror = function() {
            console.warn(`No se pudo cargar la imagen: ${imagenSrc}`);
            this.style.display = 'none';
        };
        
        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
    });
}

// Exportar función principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cargarGaleriaInstagram, INSTAGRAM_CONFIG };
}
