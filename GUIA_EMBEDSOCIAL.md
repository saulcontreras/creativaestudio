# 📸 Guía Rápida: Configurar EmbedSocial para Historias Destacadas

## ⚠️ Importante: Elfsight NO soporta Historias Destacadas

Si estás en Elfsight y necesitas mostrar **historias destacadas** (highlights), Elfsight no tiene esta funcionalidad. Solo muestra el feed de publicaciones.

**Solución:** Usa **EmbedSocial** que sí soporta historias destacadas.

---

## 🚀 Pasos para Configurar EmbedSocial

### Paso 1: Crear Cuenta en EmbedSocial

1. Ve a: https://embedsocial.com/es/stories/highlights/
2. Haz clic en "Start Free Trial" o "Regístrate Gratis"
3. Completa el registro (puedes usar email o conectar con Google/Facebook)

### Paso 2: Conectar tu Instagram

1. Una vez dentro del dashboard, busca la opción **"Instagram Stories"** o **"Stories Highlights"**
2. Haz clic en **"Connect Instagram"** o **"Conectar Instagram"**
3. Te pedirá autorización:
   - Inicia sesión con tu cuenta de Instagram (@creativaestudio_vdr)
   - Autoriza a EmbedSocial para acceder a tus historias destacadas
   - Acepta los permisos necesarios

### Paso 3: Seleccionar el Highlight

1. Después de conectar, verás una lista de tus historias destacadas
2. Selecciona el highlight que quieres mostrar (ej: "Tallercitos")
3. O selecciona múltiples highlights si quieres mostrar varios

### Paso 4: Personalizar el Widget

1. **Diseño:**
   - Tamaño del widget
   - Colores (puedes usar los colores de tu marca: morado, rosa, amarillo)
   - Estilo de navegación

2. **Configuración:**
   - Número de historias a mostrar
   - Auto-play
   - Mostrar controles

3. **Responsive:**
   - Asegúrate de que se vea bien en móvil y desktop

### Paso 5: Obtener el Código

1. Una vez personalizado, haz clic en **"Generate Code"** o **"Generar Código"**
2. EmbedSocial te dará un código HTML/JavaScript
3. **Copia TODO el código** (incluye divs y scripts)

### Paso 6: Integrar en tu Landing Page

1. Abre el archivo `js/instagram-gallery.js`

2. Busca la sección de configuración (alrededor de la línea 15):
   ```javascript
   const INSTAGRAM_CONFIG = {
       useThirdParty: false, // ← Cambia esto a true
       serviceType: 'embedsocial', // ← Ya está bien
       widgetId: '', // ← Aquí va el ID que te da EmbedSocial
   ```

3. **Opción A: Usar el código completo de EmbedSocial**
   - Abre `index.html`
   - Busca la sección de galería (línea ~73):
   ```html
   <div class="gallery-grid" id="gallery">
       <!-- Las imágenes se cargarán dinámicamente desde JavaScript -->
   </div>
   ```
   - Reemplaza ese div con el código completo que te dio EmbedSocial
   - O simplemente pega el código de EmbedSocial justo después de ese div

4. **Opción B: Configurar en JavaScript** (si EmbedSocial te da solo un ID)
   - Actualiza `js/instagram-gallery.js`:
   ```javascript
   const INSTAGRAM_CONFIG = {
       useThirdParty: true,
       serviceType: 'embedsocial',
       widgetId: 'TU_WIDGET_ID_AQUI', // El ID que te dio EmbedSocial
   };
   ```

### Paso 7: Probar

1. Abre `index.html` en tu navegador
2. Ve a la sección "Galería de tallercitos"
3. Deberías ver tus historias destacadas de Instagram

---

## 💡 Consejos

- **Plan Gratuito:** EmbedSocial tiene un plan gratuito con limitaciones (número de widgets, marca de agua, etc.)
- **Plan de Pago:** Si necesitas más funcionalidades, tienen planes desde ~$9/mes
- **Actualización Automática:** Las historias se actualizan automáticamente cuando agregas nuevas al highlight

---

## 🔄 Alternativa: Si Quieres Usar Elfsight

Si prefieres quedarte con Elfsight (aunque no muestre historias destacadas, solo publicaciones):

1. En el dashboard de Elfsight, crea un widget de **"Instagram Feed"**
2. Conecta tu Instagram
3. Configura para mostrar publicaciones recientes
4. Obtén el código
5. Actualiza `js/instagram-gallery.js`:
   ```javascript
   const INSTAGRAM_CONFIG = {
       useThirdParty: true,
       serviceType: 'elfsight',
       widgetId: 'TU_WIDGET_ID_ELFSIGHT',
   };
   ```

---

## ❓ ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa la documentación de EmbedSocial: https://embedsocial.com/help/
2. Contacta su soporte (generalmente responden rápido)
3. Puedes usar el modo manual mientras tanto (actualizando URLs manualmente)

---

**Nota:** El código de EmbedSocial generalmente incluye todo lo necesario (HTML + JavaScript), así que solo necesitas pegarlo en tu página.
