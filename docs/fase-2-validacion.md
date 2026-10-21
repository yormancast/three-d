# Evidencia de cierre — Fase 2

Registro incremental de validación y del límite entre archivos de entrega y recursos locales. Actualizado durante la implementación, 20 de octubre de 2026.

## F2-08 — Inventario de entrega

### Archivos que deben formar parte de la entrega versionada

- Aplicación y configuración rastreada que aparece modificada en `git status`: `README.md`, `models/README.md`, `src/App.vue`, `src/content/index.ts`, `src/scene/index.ts`, `src/scene/types.ts`, `src/styles/base.css` y `src/styles/tokens.css`.
- Código nuevo requerido por la implementación: `src/components/PublicScene.vue`, `src/components/SceneStatus.vue`, `src/components/SceneViewport.vue`, `src/components/review/SceneReview.vue`, `src/composables/useEnvironment.ts`, `src/scene/assets.ts`, `src/scene/assets.test.ts`, `src/scene/continuousMotion.ts`, `src/scene/continuousMotion.test.ts`, `src/scene/materials.ts`, `src/scene/motionPlayback.ts`, `src/scene/ballMotion.ts`, `src/scene/camera.ts`, `src/scene/postprocessing.ts` y sus pruebas existentes/nuevas.
- Recurso servido por la aplicación: `public/models/continuous/dirto-continuous.glb` (15.449.252 bytes, SHA-256 `6505a219d8834c80997a1a78222ed57dc99e921efcbcde434396e6a1753163bc`) y `public/models/continuous/preview.jpg` (147.784 bytes, SHA-256 `4a4ab16f503c1aa6ce1aee5ba13f836bcf653729246f65fca06e221192a1d341`).
- Documentación necesaria para mantener y validar el recurso: `public/models/README.md`, `docs/arquitectura-v3.md`, `docs/plan-v3.md`, `docs/tareas-fase-2.md`, `docs/exportacion-web-glb-unico.md`, `docs/assets/continuous-contract.md`, `docs/assets/organization-manifest.json`, `docs/assets/polyhaven-manifest.json`, los documentos de animación y dirección de arte referenciados por esos planes, además de este registro.
- `package.json`, `package-lock.json`, `.nvmrc`, `RULES.md`, configuración Vite/TypeScript/ESLint y workflow CI ya están versionados y son parte del checkout reproducible.

La lista de arriba identifica el conjunto necesario; no añade archivos al índice de Git. Los cambios previos del árbol se revisan uno a uno antes de preparar un commit.

### Archivos retirados y recursos locales

- `public/models/.gitkeep` y `public/models/el_dirto_v11.glb` aparecen eliminados del árbol. Son retiros intencionales de distribuciones antiguas; `models/archive/public-models/` conserva el histórico local según `docs/assets/organization-manifest.json`.
- `.gitignore` ignora `models/*` y permite `models/README.md`. `models/dirto-continuous.glb` es una entrada local, no una dependencia del build ni un respaldo remoto. Al revisar, coincide byte a byte con el GLB activo (SHA-256 anterior).
- Los recursos históricos bajo `models/archive/public-models/`, otras exportaciones locales de Blender y archivos de trabajo no se sirven ni son requisito para instalar/build. Su conservación local no equivale a respaldo versionado.
- Las licencias y procedencia están resumidas en `public/models/README.md`; el contrato confirma que el GLB activo integra sus imágenes y no necesita URIs externas.

### Rutas y distribución

La escena usa `${import.meta.env.BASE_URL}models/continuous/dirto-continuous.glb`; el poster usa `${import.meta.env.BASE_URL}models/continuous/preview.jpg`. Vite copia `public/models/continuous/` al directorio `dist/models/continuous/`.

**Evidencia F2-08:** ambas rutas están bajo `public/`; hashes revisados con `shasum -a 256`; `models/dirto-continuous.glb` está ignorado por Git y coincide con el recurso servido. El build de producción pasa. La instalación limpia y la prueba visual del servidor quedan en las tareas siguientes.

## Comprobaciones ejecutadas durante el trabajo

| Comprobación | Resultado más reciente |
| --- | --- |
| `npm run check` | Aprobado; 29 pruebas en 6 archivos |
| `npm run build` | Aprobado; aviso de chunk JavaScript mayor de 500 kB |
| Build público | Genera un único chunk de aplicación; el markup visible de controles de revisión no está presente en los assets de producción |

Los resultados aquí documentados son del árbol de trabajo y no certifican aún un checkout limpio de un commit.

## F2-09 — Instalación aislada

Se copió el inventario de entrega a `/private/tmp/three-d-phase2.qnM5EW`, sin `.git`, `node_modules`, `dist` ni los modelos históricos/locales ignorados. Se instaló desde `package-lock.json` con `npm ci` y se ejecutaron `npm run check` y `npm run build`.

**Resultado:** aprobado con Node 24.19.0 y npm 10.8.2. Tras actualizar la copia con los últimos cambios de la fase, `npm run check` pasó con 30 pruebas en 6 archivos y `npm run build` produjo el asset público. Sigue apareciendo el aviso de chunk JavaScript sobre 500 kB. Esta copia refleja el árbol de trabajo al momento de copiar; el checkout limpio de un commit queda pendiente de F2-12.

## F2-10 — Revisión interactiva

**Entorno:** navegador integrado, escritorio 1280×720; dev server en `127.0.0.1:5173` y build de producción en `127.0.0.1:4173`.

- La escena cargó el GLB con texturas, incluyendo personaje, entorno, emisivos y balón. El canvas reemplazó el poster al terminar la carga.
- Recorrido observado: Recovery → Pickup/Dribble → Crossover → Rise/Standing → Shot (balón en vuelo) → Standing → Rise/Pickup en reversa → Recovery.
- Pausa/reanudación mantuvo el tiempo fijo; seek movió el clip a 6.4 s.
- Se seleccionaron Home, Bio, Projects, Experience y Contact, y se alternó atmósfera. Las cinco selecciones funcionaron.
- En el build servido, la escena quedó visible con el wordmark y estado de carga; los controles técnicos no aparecieron. El inspector de revisión no se cargó.
- Observación para ajustar junto al contenido de fase 4: Bio y Contact encuadran el personaje muy cerca; el casco queda rozando el borde superior en el viewport probado. No es una regresión de carga ni del recurso.

**Revisión adicional:** viewport emulado 390×844. El GLB, los controles de animación y los cinco puntos de vista cargan; `scrollWidth` no supera `innerWidth`. El personaje se ve desplazado hacia la izquierda del encuadre, sin quedar completamente recortado. El navegador reportó `prefers-reduced-motion: no-preference`. Al cambiar de pestaña, el reloj no dio una medida repetible por el tiempo que toma restaurar el contexto; el cambio de pestaña por sí solo no cuenta como cierre de la comprobación.

**Cierre F2-10:** se activó temporalmente Reduce motion en macOS, se confirmó `prefers-reduced-motion: reduce`, arranque pausado en 0 y reanudación explícita; luego se restauró el ajuste original. En Chrome de escritorio, al ocultar la pestaña durante la reproducción, el reloj pasó de 3.56 s a 3.52 s al volver y avanzó en una lectura posterior. La emulación de viewport 390×844 no sustituye una prueba de rendimiento en móvil real.

## F2-11 — Fallos, reintentos y build público

Las pruebas de fallo se hicieron en la copia temporal `/private/tmp/three-d-phase2.qnM5EW`; los recursos y excepciones forzados se retiraron al terminar.

- URL inexistente: permaneció el poster; el mensaje indicó que el recurso 3D no estaba disponible. Reintentar con la ruta todavía rota mantuvo un único estado de error y el botón disponible. Tras colocar el GLB en esa ruta, el botón volvió a ejecutar la carga y la escena quedó lista.
- GLB incompatible: se modificó temporalmente el nombre de `ElDirto_Character` dentro de una copia binaria válida. La validación rechazó el recurso e identificó el nodo faltante; la UI conservó el poster.
- Inicialización 3D no disponible: una excepción temporal en la construcción del renderer mostró el estado genérico de indisponibilidad, poster y acción de reintento.
- Desmontaje durante carga: se introdujo en la copia una demora temporal de tres segundos después de recibir el GLB y se navegó fuera mientras la promesa seguía pendiente. No aparecieron errores de consola; una visita posterior cargó la escena completa.
- Build público: `npm run build` aprobado; en `127.0.0.1:4173` se observó un canvas y el encabezado público, sin botones o controles técnicos. Continúa el aviso de Vite por chunk JS de 749.96 kB.

**Comprobaciones tras el cambio de manejo de errores:** `npm run check` aprobado (30 pruebas en 6 archivos) y `npm run build` aprobado. Node 20.20.2. Las comprobaciones no son de un checkout limpio de commit; esa evidencia pertenece a F2-12.
