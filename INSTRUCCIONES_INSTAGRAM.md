# 📸 Guía: Conectar Galería con Instagram

Esta guía te explica cómo conectar la galería de tallercitos con tus historias destacadas de Instagram.

## 🎯 Opciones Disponibles

Tienes **3 opciones** para obtener las imágenes desde Instagram. Elige la que mejor se adapte a tus necesidades:

---

## ✅ OPCIÓN 1: Servicio de Terceros (RECOMENDADO - Más Fácil)

Esta es la opción **más sencilla** y no requiere conocimientos técnicos avanzados.

### Usando EmbedSocial (Recomendado)

1. **Regístrate en EmbedSocial**
   - Ve a: https://embedsocial.com/es/stories/
   - Crea una cuenta gratuita o de pago

2. **Conecta tu Instagram**
   - En el panel de EmbedSocial, conecta tu cuenta de Instagram
   - Autoriza el acceso a tus historias destacadas

3. **Crea el Widget**
   - Selecciona "Instagram Stories"
   - Elige el highlight que quieres mostrar (ej: "Tallercitos")
   - Personaliza el diseño para que coincida con tu landing page

4. **Obtén el Código**
   - EmbedSocial te dará un código HTML/JavaScript
   - Copia ese código

5. **Integra en tu Landing Page**
   - Abre `js/instagram-gallery.js`
   - Busca la función `cargarWidgetTerceros()`
   - Reemplaza el código de ejemplo con el código que te dio EmbedSocial
   - Cambia `useThirdParty: false` a `useThirdParty: true` en la configuración

### Alternativa: Elfsight (Gratis)

1. Ve a: https://elfsight.com/es/instagram-feed-instashow/
2. Crea una cuenta gratuita
3. Conecta tu Instagram
4. Obtén el código del widget
5. Sigue los mismos pasos que con EmbedSocial

**Ventajas:**
- ✅ Muy fácil de configurar
- ✅ Se actualiza automáticamente
- ✅ No necesitas conocimientos técnicos
- ✅ Soporte técnico incluido

**Desventajas:**
- ⚠️ Algunos servicios tienen límites en el plan gratuito
- ⚠️ Puede mostrar marca de agua (en planes gratuitos)

---

## 🔧 OPCIÓN 2: Instagram Graph API (Para Desarrolladores)

Esta opción requiere una cuenta de Instagram Business o Creator y conocimientos técnicos.

### Requisitos Previos

1. **Tu cuenta de Instagram debe ser Business o Creator**
   - Ve a Configuración de Instagram → Cuenta → Cambiar a cuenta profesional
   - Elige "Negocio" o "Creador"

2. **Crea una App en Facebook Developers**
   - Ve a: https://developers.facebook.com/
   - Crea una cuenta o inicia sesión
   - Crea una nueva App
   - Agrega el producto "Instagram Graph API"

3. **Obtén el Access Token**
   - En tu App, ve a "Herramientas" → "Explorador de Graph API"
   - Genera un token de acceso de larga duración
   - **IMPORTANTE**: Guarda este token de forma segura

4. **Obtén tu Instagram User ID**
   - Usa el Explorador de Graph API
   - Busca tu cuenta: `me?fields=id,username`
   - Anota tu User ID

### Configuración en tu Código

1. Abre `js/instagram-gallery.js`

2. Actualiza la configuración:
```javascript
const INSTAGRAM_CONFIG = {
    useGraphAPI: true, // Cambiar a true
    accessToken: 'TU_TOKEN_AQUI', // Pegar tu token
    userId: 'TU_USER_ID_AQUI', // Pegar tu User ID
    useThirdParty: false,
    useManual: false
};
```

**Nota Importante:** 
- La API de Instagram Graph API **NO expone directamente las historias destacadas**
- Esta opción obtendrá tus **publicaciones recientes** como alternativa
- Las historias destacadas no están disponibles en la API pública

**Ventajas:**
- ✅ Control total sobre los datos
- ✅ Gratis (sin límites de terceros)
- ✅ Sin marcas de agua

**Desventajas:**
- ⚠️ Requiere conocimientos técnicos
- ⚠️ No accede directamente a historias destacadas
- ⚠️ Requiere configuración inicial compleja

---

## 📝 OPCIÓN 3: Actualización Manual (Actual)

Esta es la opción que ya tienes funcionando. Puedes mejorarla obteniendo URLs directas de tus imágenes de Instagram.

### Cómo Obtener URLs de Imágenes de Instagram

1. **Desde el Navegador (Chrome/Firefox)**
   - Abre tu perfil de Instagram en el navegador
   - Ve a tus historias destacadas
   - Haz clic derecho en una imagen → "Inspeccionar elemento"
   - Busca la etiqueta `<img>` y copia el valor de `src`
   - La URL será algo como: `https://scontent.cdninstagram.com/v/...`

2. **Usando Herramientas Online**
   - Ve a: https://www.instagram.com/creativaestudio_vdr/
   - Usa herramientas como "Downloader for Instagram" (extensión del navegador)
   - Descarga las imágenes y súbelas a tu servidor

3. **Actualizar el Código**
   - Abre `js/instagram-gallery.js`
   - Busca la función `obtenerImagenesManuales()`
   - Agrega las URLs en el array:
   ```javascript
   const imagenesManuales = [
       'https://scontent.cdninstagram.com/v/...', // URL de imagen 1
       'https://scontent.cdninstagram.com/v/...', // URL de imagen 2
       // ... más URLs
   ];
   ```

**Ventajas:**
- ✅ Control total
- ✅ No requiere servicios externos
- ✅ Funciona siempre

**Desventajas:**
- ⚠️ Actualización manual cada vez
- ⚠️ Las URLs de Instagram pueden expirar

---

## 🚀 Recomendación Final

Para tu caso, recomiendo la **OPCIÓN 1 (EmbedSocial o Elfsight)** porque:
- Es la más fácil de configurar
- Se actualiza automáticamente cuando agregas nuevas historias
- No requiere mantenimiento técnico
- Tiene soporte si necesitas ayuda

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo usar las imágenes directamente desde Instagram sin servicios?**
R: Técnicamente sí, pero las URLs de Instagram expiran y pueden cambiar. No es recomendable para producción.

**P: ¿Cuál es la mejor opción gratuita?**
R: Elfsight ofrece un plan gratuito con limitaciones, o puedes usar la opción manual.

**P: ¿Las historias destacadas se actualizan automáticamente?**
R: Solo con servicios de terceros (Opción 1) o con la API (Opción 2, pero solo publicaciones, no historias destacadas).

**P: ¿Necesito un servidor backend?**
R: No, todas las opciones funcionan desde el frontend. Solo la Opción 2 requiere configuración inicial.

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas configurando alguna opción, puedes:
1. Revisar la documentación de EmbedSocial/Elfsight
2. Contactar su soporte técnico
3. Volver a la opción manual mientras tanto

---

**Nota de Seguridad:** Nunca compartas tus tokens de acceso de Instagram públicamente. Si los guardas en el código, asegúrate de que el archivo no se suba a repositorios públicos.
