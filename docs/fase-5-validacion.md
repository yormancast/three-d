# Validación de fase 5 — Projects, Experience y Contact

22 de octubre de 2026. Validación del árbol de trabajo local de `/Users/yorman/Projects/Repos/three-d`; no se creó commit. F5-00–F5-07 cerradas. El usuario aceptó cerrar sin exportar las capturas revisadas a `docs/evidencia/fase-5/`; no hay PNG en esa carpeta.

## Estado y decisiones editoriales

- Projects presenta un único caso histórico: el sitio anterior, con el texto de v1 autorizado provisionalmente por el usuario. El texto íntegro queda sujeto a la revisión editorial que el usuario pospuso.
- Experience permanece vacía por decisión explícita del usuario (“dejala vacia”). Conserva su título y el CTA hacia Contact; no muestra cargos ni fechas ficticias.
- Contact usa el texto de v1 y su enlace confirmado a LinkedIn, corrigiendo solo la errata en el nombre del servicio.
- Shot público no fue adoptado; queda fuera del alcance base.

## Build y entorno

- Sitio de producción local: `http://127.0.0.1:4173/`.
- Navegador: Chrome integrado de Codex con la aplicación local.
- Viewports: 1280×720, 390×844, 390×480, 1280×480, 799×720, 800×720 y 640×360. Este último representa el espacio de viewport aproximado a zoom 200 %; no equivale a cambiar el zoom real del navegador.
- `npm run check`: aprobado después del ajuste visual; formato, ESLint, Stylelint, TypeScript y 46 pruebas en 10 archivos.
- `npm run build`: aprobado. El JavaScript principal pesa 762.63 kB (203.91 kB gzip), por encima del umbral de aviso de 500 kB. Vite también reporta tiempos de callback del plugin Tailwind; no impide el build.
- La consola del navegador de producción no registró errores ni advertencias durante las vistas revisadas.

## Composición y lectura

- Se revisaron Home, Bio, Projects, Experience y Contact a 1280×720 y 390×844. En escritorio las tarjetas permanecen a la derecha; en móvil, debajo del personaje y sin conector.
- El texto provisional de Projects es mucho más largo que una tarjeta móvil estándar. En [SectionCard.vue](../src/components/SectionCard.vue) se limita su altura móvil a 48svh y se conserva el desplazamiento interno. En 390×844 la tarjeta queda en x=12–378 px, y=365–770 px; el rostro queda visible por encima del panel.
- A 390×480, Projects ocupa x=12–378 px, y=176–406 px. El scroll interno lleva hasta el enlace Sketchfab y `Next: Experience`; ambos quedan visibles tras desplazar. No hay desbordamiento horizontal.
- En 390×480 Bio y Contact también se desplazan internamente dentro de la altura limitada; Experience, vacía, muestra `Next: Contact` sin necesidad de scroll. Todas las tarjetas mantienen 12 px de margen horizontal y el menú inferior queda accesible.
- En 1280×480 la tarjeta larga se desplaza dentro del panel. El borde 799/800 px conserva el diseño móvil a 799 y el de escritorio desde 800; no hay desbordamiento horizontal. En 640×360, como viewport aproximado a zoom 200 %, el enlace Sketchfab y el CTA de Projects quedan accesibles tras desplazar la tarjeta.
- La revisión visual es técnica y no representa aprobación artística del usuario. No se probó rendimiento en un móvil físico.

## Navegación, escena y accesibilidad

- La entrada directa por los cinco hashes muestra la sección correspondiente. `#nonsense` vuelve a `#home`; atrás/adelante restauran Home y Experience con foco en el título activo.
- Home → Bio → Projects → Experience → Contact → Home funcionó por navegación. El CTA de Experience abre Contact; Escape y el botón de cierre devuelven a Home y enfocan el botón Home.
- Tab y Shift+Tab recorren Bio/Home en orden; pausa/reanudación expone `Pause animation` y `Resume animation` con `aria-pressed` coherente.
- Projects → Experience → Projects durante Rise, Experience → Contact → Bio durante el retorno y varias selecciones rápidas terminando en Contact conservaron la última selección/hash. El DOM mantuvo un único canvas. La cámara terminó el encuadre de Contact aun con la animación pausada; la etiqueta de reanudación permaneció mientras se navegó.
- `/?review=1#projects` en producción mostró el portafolio público y no expuso controles técnicos.
- La preferencia `prefers-reduced-motion` del navegador de esta sesión estaba en `false`; esta interfaz no expuso una emulación para volver a activarla. Se conserva la verificación anterior de movimiento reducido en [validación de fase 4](fase-4-validacion.md). La navegación pausada sí se repitió en F5.

## Fallo y recuperación de la escena

Se sirvió una copia temporal del build desde `/private/tmp/f5-validation-dist`, con el GLB apartado solo de esa copia. Projects, Experience y Contact conservaron navegación y contenido, incluido el enlace LinkedIn. Tras restaurar el GLB en la copia y pulsar `Try again`, la escena recuperó el estado listo en `#contact`; la selección se conservó. La salida `dist/` y los assets fuente del repositorio no se usaron para provocar el fallo.

La ausencia real de WebGL se había probado en fase 4 y conserva su captura [Bio sin WebGL](evidencia/fase-4/no-webgl-bio.png). En F5 se validó el mismo fallback público con un fallo de carga del GLB en las nuevas vistas, pero no se repitió el lanzamiento de Chrome sin WebGL.

La conservación de pausa durante un reintento se verificó en `useEnvironment`: el valor `playing` no se reinicia al iniciar otra carga y se aplica con `instance.setPlaying(playing.value)` a cada instancia nueva. El control público se oculta en error, así que el navegador no permite accionar pausa allí; el control solo se muestra cuando la escena está lista. La revisión confirma que un reintento tras una pausa previa conserva esa intención, aunque no se pudo accionar el caso completo desde la interfaz pública porque el controlador disponible no expuso interceptación de red ni un disparador de pérdida de contexto.

## Evidencia visual y límite de exportación

Las capturas de las cinco vistas en escritorio y móvil, junto con Projects a 390×480 antes y después del scroll, se generaron y revisaron en el navegador durante esta tarea. El API de captura devolvió las imágenes para inspección visual, pero no ofreció una ruta de archivo dentro del workspace; por decisión del usuario se cierra F5-07 sin exportar esos PNG y no se atribuyen archivos inexistentes. Las capturas persistentes de Home y Bio de fase 4 están en [evidencia de fase 4](evidencia/fase-4/).

## Enlaces

- [Tareas y resultados por tarea](tareas-fase-5.md).
- [Plan general v3](plan-v3.md).
- [Validación de fase 4](fase-4-validacion.md).
