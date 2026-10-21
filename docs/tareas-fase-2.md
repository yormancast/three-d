# Fase 2 — Tareas para ejecutar con Luna

Lista ejecutable derivada de [plan-v3.md](plan-v3.md) y [arquitectura-v3.md](arquitectura-v3.md). Las casillas representan trabajo pendiente, no funcionalidades ausentes en su totalidad.

## Cómo ejecutar

Ejecutar una tarea por turno, en orden, con el mismo árbol de trabajo. Antes de cada tarea, revisar los cambios existentes y leer `RULES.md`. Conservar el trabajo previo, incluidos archivos sin seguimiento. No reiniciar la implementación ni sustituir la máquina de reproducción.

Prompt reutilizable:

> Ejecuta únicamente la tarea F2-XX de docs/tareas-fase-2.md. Lee sus dependencias, RULES.md y los archivos relevantes antes de editar. Implementa el alcance completo, verifica el resultado y marca la tarea solo si cumple todos sus criterios de cierre. Informa archivos modificados, comprobaciones y limitaciones. No hagas commit, push ni despliegue. No avances a otra tarea automáticamente.

Cada tarea debe registrar evidencia breve debajo de su apartado: comandos y resultados, o navegador, tamaño de pantalla y recorrido realizado. Una comprobación no ejecutada queda pendiente. Ejecutar las pruebas pertinentes durante el trabajo y `npm run check` al cerrar cada tarea de código; reservar el build completo para los puntos indicados y para cambios que lo justifiquen.

No incluye navegación de secciones, tarjetas Home/Bio, nuevas animaciones, ajustes artísticos ni optimización de texturas. Esos trabajos pertenecen a fases posteriores.

## 1. Contrato del recurso

### F2-01 — Especificar el contrato real del GLB

- [x] Completada: [contrato del recurso](assets/continuous-contract.md).

**Dependencias:** ninguna.

**Referencias:** `public/models/continuous/dirto-continuous.glb`, `src/scene/continuousMotion.ts`, `src/scene/motionAssets.test.ts`, `docs/exportacion-web-glb-unico.md`.

**Trabajo:** inspeccionar el JSON del GLB y documentar en `docs/assets/continuous-contract.md` dónde vive la versión y qué significa; grupos obligatorios, nodo Ball, malla animada, siete clips, pistas y estructura de metadata. Registrar reglas de duración, rangos de `standing` y `shot`, y semántica de gates por clip. Confirmar si un array vacío de gates es válido. Distinguir requisitos de compatibilidad de datos informativos como hash, tamaño y número actual de morph targets.

**Cierre:** contrato respaldado por el archivo real, sin inventar campos ni exigir valores accidentales de una exportación. Si falta una versión explícita, documentarlo y definir una política compatible antes de implementar el validador; no reexportar el modelo.

**Evidencia:** inspección del JSON GLB: `asset.version` es `2.0`; `scenes[0].extras.formatVersion` es `1`; `motionData` está junto a ella en `extras`. Los siete clips tienen gates y las listas vacías son válidas como ausencia de salidas preferidas, porque el ciclo completo sigue siendo un límite natural de reproducción. Se registraron los nodos, pistas y rangos normalizados observados.

### F2-02 — Validar metadata de movimiento

- [x] Completada: parser de formato 1 y pruebas de datos inválidos.

**Dependencias:** F2-01.

**Archivos:** `src/scene/continuousMotion.ts` y pruebas de validación asociadas.

**Trabajo:** validar entradas `unknown` antes de tratarlas como `MotionData`; duración finita y positiva; frames estructurados, tiempos crecientes y límites; vectores finitos; rangos semánticos confirmados; gates finitos y dentro del intervalo, con orden y duplicados según el contrato. Validar la versión en el nivel donde realmente esté almacenada. Emitir errores que identifiquen clip y campo.

**Pruebas:** recurso válido y casos inválidos de estructura, versión, duración, gates, tiempos y vectores. Comprobar que los siete clips reales siguen pasando.

**Cierre:** ninguna entrada inválida probada llega al reproductor ni falla con un error accidental de acceso a propiedades.

**Evidencia:** `npm run check` aprobado durante F2-02; los cambios posteriores también pasan el check integral.

### F2-03 — Extraer carga y validar la estructura completa

- [x] Completada: `src/scene/assets.ts` carga y valida antes de montar.

**Dependencias:** F2-02.

**Archivos:** crear `src/scene/assets.ts`; adaptar `src/scene/index.ts` y pruebas de recursos.

**Trabajo:** trasladar la carga con MeshoptDecoder; validar grupos, Ball, malla con deformaciones, clips requeridos y compatibilidad de pistas/duraciones con metadata. Devolver referencias tipadas para evitar búsquedas repetidas. Validar antes de adaptar materiales o añadir el modelo a la escena. Asegurar que un recurso rechazado se libera; completar la propiedad compartida en F2-04.

**Pruebas:** grupo, balón o clip ausente; deformaciones incompatibles; duración discordante; GLB real aceptado.

**Cierre:** la fachada consume un recurso validado y conserva el flujo de error/reintento. La escena no importa Vue ni contenido.

**Evidencia:** `validateSceneAssets` aceptó el GLB real (112 morph targets y siete clips) y rechazó clip/grupo ausentes; los cambios posteriores también pasan el check integral.

## 2. Materiales y recursos

### F2-04 — Centralizar propiedad y liberación

- [x] Completada: liberación deduplicada por identidad y segura ante llamadas repetidas.

**Dependencias:** F2-03.

**Archivos:** `src/scene/assets.ts`, `src/scene/index.ts`; crear un módulo de recursos solo si evita duplicación real.

**Trabajo:** definir quién posee geometrías, materiales y texturas originales y creados. Deduplicar su liberación por identidad. Cubrir validación fallida, adaptación fallida, desmontaje, carga que termina después del desmontaje y llamadas repetidas a `dispose`. Incluir gradiente toon, material de sombras, postproceso, listeners y observer; revisar también la inicialización parcial si falla la creación de la escena.

**Pruebas:** usar recursos compartidos e instrumentar `dispose`; verificar una liberación por recurso y limpieza en errores/cargas tardías, sin necesitar una GPU para esas pruebas.

**Cierre:** las rutas de éxito y error tienen dueño explícito y ninguna deja el GLB fuera de la limpieza.

**Evidencia:** pruebas con geometría/material/textura compartidos, materiales retirados del árbol y llamadas repetidas; cada `dispose` ocurre una vez. `createScene.dispose()` es idempotente, limpia un GLB que falle durante adaptación y cubre fallos al inicializar postproceso, materiales y observer. `npm run check` aprobado con 30 pruebas en 6 archivos.

### F2-05 — Extraer adaptación de materiales

- [x] Completada: adaptación por grupo aislada en `src/scene/materials.ts`.

**Dependencias:** F2-04.

**Archivos:** crear `src/scene/materials.ts`; adaptar `src/scene/index.ts`.

**Trabajo:** mover adaptación por grupo y receptores de sombras; integrar los recursos creados con la propiedad definida en F2-04. Conservar entorno horneado, cuero del balón, toon del personaje, emisivos y parámetros visuales existentes. Mantener colores recibidos por configuración.

**Cierre:** `index.ts` coordina y `materials.ts` adapta; no cambian cámaras, texturas, luces ni coreografía. Las comprobaciones pasan y `npm run build` funciona. La equivalencia visual se revisa en F2-10.

**Evidencia:** `npm run check` (30 pruebas en 6 archivos) y `npm run build` aprobados. Los materiales originales del personaje se retienen para que el dueño de recursos los libere junto con sus texturas.

## 3. Separación del visor

### F2-06 — Extraer viewport y estados de carga

- [x] Completada: canvas/poster y estado de carga/error son componentes separados.

**Dependencias:** F2-05.

**Archivos:** `src/App.vue`, `src/composables/useEnvironment.ts`; crear `src/components/SceneViewport.vue` y `SceneStatus.vue` si esas responsabilidades justifican ambos componentes.

**Trabajo:** separar canvas/poster y presentación de carga/error/reintento. Mantener un solo dueño del ciclo de vida en el composable y una sola instancia de escena. Elegir un contrato Vue explícito para disponer del canvas al montar, sin importar tipos de escena en la UI. Conservar el comportamiento y estilos actuales.

**Cierre:** carga, fallo, reintento y desmontaje siguen conectados; los componentes cumplen R1–R7 y no crean una segunda escena.

**Evidencia:** el canvas se entrega al composable por evento al montar el viewport antes del `onMounted` del dueño de escena; `npm run check` y `npm run build` aprobados.

### F2-07 — Aislar controles de revisión en desarrollo

- [x] Completada: visor de inspección cargado solo en desarrollo.

**Dependencias:** F2-06.

**Archivos:** crear `src/components/review/SceneReview.vue`; adaptar `src/App.vue` y el composable solo cuando sea necesario.

**Trabajo:** trasladar selección de cámaras/animaciones, timeline, información técnica y controles de inspección. Habilitar el visor únicamente con `import.meta.env.DEV`, preferiblemente mediante importación dinámica condicionada. Si se añade un parámetro para abrirlo, documentarlo y exigir también DEV. Mantener escena, poster y recuperación disponibles en producción. No construir todavía las secciones del portafolio.

**Cierre:** los controles funcionan en desarrollo y ninguna URL o parámetro los habilita al servir el build de producción. Verificar con `npm run build` y preview. Registrar si el código del visor queda fuera de los artefactos de producción.

**Evidencia:** `npm run build` aprobado; el build genera el chunk público y el texto/markup de los controles de revisión no aparece en `dist/assets`.

## 4. Reproducción y entrega

### F2-08 — Preparar el inventario de la entrega

- [x] Completada: [inventario de entrega](fase-2-validacion.md#f2-08--inventario-de-entrega).

**Dependencias:** F2-07.

**Referencias:** `git status`, `.gitignore`, `public/models/README.md`, `models/README.md`, `docs/assets/organization-manifest.json`.

**Trabajo:** revisar cambios y archivos sin seguimiento, distinguir entregables de recursos locales/históricos y registrar rutas necesarias en `docs/fase-2-validacion.md`. Confirmar GLB y poster servidos, rutas BASE_URL, licencias y ausencia de dependencias de `models/`. Revisar que los borrados públicos corresponden al archivo histórico documentado. No ejecutar `git add .` ni borrar cambios ajenos.

**Cierre:** inventario explícito de lo que debe versionarse y de lo que sigue local. Esta tarea prepara la entrega; no afirma que ya exista un commit reproducible.

**Evidencia:** se verificaron `.gitignore`, los archivos activos y las eliminaciones, licencias y hashes. El informe identifica lo que debe versionarse y el archivo histórico local ignorado; no se ejecutó `git add`.

### F2-09 — Comprobar instalación aislada

- [x] Completada: copia temporal instalada y comprobada sin `node_modules` previo.

**Dependencias:** F2-08.

**Trabajo:** crear una copia temporal del inventario de entrega, incluidos archivos nuevos necesarios, sin `node_modules`, `dist`, `.git` ni `models/`. Ejecutar `npm ci`, `npm run check` y `npm run build`. Registrar versiones de Node/npm y resultados en `docs/fase-2-validacion.md`. No reinstalar destructivamente sobre el directorio de trabajo.

**Cierre:** la copia aislada instala y construye usando solo archivos de entrega. Identificarla como copia del árbol de trabajo; comprobar un checkout limpio del commit final en F2-12.

**Evidencia:** copia temporal `/private/tmp/three-d-phase2.qnM5EW`; `npm ci`, `npm run check` (29 pruebas en 6 archivos) y `npm run build` aprobados con Node 24.19.0/npm 10.8.2. Es copia del árbol de trabajo, sin `.git`, `dist`, `node_modules` previo ni assets históricos locales.

### F2-10 — Revisar reproducción completa en navegador

- [x] Completada: reproducción, viewport estrecho, movimiento reducido y ciclo de pestaña revisados.

**Dependencias:** F2-09.

**Trabajo:** cargar el GLB con sus texturas reales; revisar entorno, emisivos, personaje y balón. Recorrer Recovery → Dribble → Crossover → Standing → Shot → Standing → Recovery, comprobar Pickup/Rise y solicitudes rápidas durante transiciones. Probar pausa/reanudación, timeline del visor, cambio de cámara, resize y ocultar/restaurar pestaña. Revisar escritorio y pantalla estrecha; comprobar movimiento reducido inicial y reanudación explícita.

**Cierre:** registrar navegador, viewport, recorridos, capturas y defectos. Comparar apariencia con la versión previa disponible. Una pantalla estrecha emulada no certifica rendimiento en móvil real; no cerrar si quedan regresiones materiales sin resolver.

**Evidencia:** escritorio 1280×720 en el navegador integrado; carga de modelo/texturas, clips Recovery → Dribble → Crossover → Standing → Shot → Standing → Recovery, Pickup/Rise, pausa/reanudación, seek, cinco presets y toggle de atmósfera. Preview de producción en `127.0.0.1:4173` carga la escena y no muestra controles del visor. Los encuadres Bio y Contacto quedan muy cerrados en este viewport. Pantalla estrecha emulada 390×844: la escena y todos los controles cargan, `document.documentElement.scrollWidth` no supera `innerWidth`; el personaje se desplaza hacia la izquierda dentro del encuadre, sin recorte completo. En Chrome de escritorio, macOS Accessibility > Display > Reduce motion activado temporalmente: `prefers-reduced-motion: reduce` fue verdadero, el visor inició pausado con el reloj en 0 y el botón Reproducir avanzó el clip al activarlo. Se restauró Reduce motion a su estado original (off). Al cambiar a otra pestaña durante reproducción y volver, el reloj pasó de 3.56 s a 3.52 s; una lectura posterior mostró que seguía avanzando tras restaurar la pestaña. No se encontró regresión de reproducción al ocultar/restaurar. La prueba emulada no sustituye validación en móvil real.

### F2-11 — Revisar fallos, reintentos y build público

- [x] Completada: error comprensible, reintento recuperable y build público revisados.

**Dependencias:** F2-10.

**Trabajo:** probar URL inválida, recurso incompatible y WebGL no disponible mediante un procedimiento reproducible que no deje fallos forzados en producción. Comprobar poster y mensaje útil; restaurar condiciones y reintentar. Probar desmontaje durante carga y reintentos consecutivos sin canvas, listeners o bucles duplicados. Servir el build público y confirmar que el visor está inaccesible.

**Cierre:** recuperación comprobada con el GLB completo y evidencia en `docs/fase-2-validacion.md`. La ausencia de navegación pública todavía corresponde a fases 3–4.

**Evidencia:** en una copia temporal, una URL inexistente dejó visible el poster y mostró un mensaje específico; reintentar sin reparar la URL repitió el error y reintentar después de restaurar el GLB cargó la escena. Un GLB válido con `ElDirto_Character` renombrado fue rechazado con identificación del nodo faltante. Una excepción temporal en la creación del renderer mostró el fallback genérico de dispositivo. Un retraso temporal después de descargar el GLB permitió desmontar la página antes de resolver la carga; no aparecieron errores de consola y una visita posterior volvió a cargar. El preview de producción mostró canvas y encabezado sin controles técnicos. No se dejó ningún fallo forzado ni asset de prueba en el árbol de entrega.

### F2-12 — Cerrar evidencia y comprobar la entrega versionada

- [ ] Pendiente: requiere que se solicite por separado el commit final.

**Dependencias:** F2-11 y commit final disponible.

**Trabajo:** ejecutar `npm run check` y `npm run build` sobre el estado final. Tras disponer de un commit que incluya deliberadamente código y assets, repetir instalación/check/build en un checkout limpio temporal de ese commit y verificar las URLs del modelo/poster. Registrar revisión exacta, resultados y limitaciones. Actualizar el estado de fase 2 en `docs/plan-v3.md` según evidencia. La creación del commit se solicita por separado; no la presupone este listado.

**Cierre:** contrato validado, recursos con limpieza comprobada, visor exclusivo de desarrollo, revisión interactiva documentada y entrega reproducible desde Git. Si falta el commit o alguna comprobación, mantener esta tarea y la fase abiertas e indicar exactamente qué falta.

## Orden de ejecución

F2-01 → F2-02 → F2-03 → F2-04 → F2-05 → F2-06 → F2-07 → F2-08 → F2-09 → F2-10 → F2-11 → F2-12.

El primer turno de implementación debe ejecutar F2-01. No marcar tareas por la mera existencia de un archivo ni sustituir la revisión visual por tests de geometría.
