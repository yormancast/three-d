# Fase 3 — Plan de implementación con Luna

21 de octubre de 2026. Basado en el código actual, [plan-v3.md](plan-v3.md), [arquitectura-v3.md](arquitectura-v3.md) y la [evidencia de fase 2](fase-2-validacion.md). Registra alcance, tareas y evidencia incremental de la fase 3.

## Base que ya está lista

F2-01 a F2-11 constan completadas con evidencia registrada:

- Contrato del GLB documentado y validación de estructura, versión, clips y metadata en `assets.ts` y `continuousMotion.ts`.
- Carga integrada con Meshopt, materiales separados y liberación deduplicada de recursos.
- `MotionPlayback` mantiene gates, conectores Pickup/Rise, giro continuo, última solicitud y Shot de ejecución única.
- `useEnvironment` posee la escena, protege callbacks con generaciones y gestiona carga, error, reintento y desmontaje.
- `SceneViewport`, `SceneStatus` y `PublicScene` están separados; `SceneReview` solo se importa en desarrollo.
- Instalación aislada, reproducción, pausa, movimiento reducido inicial, pestaña oculta y fallos/reintentos revisados según el registro.
- Último check integral documentado: 30 pruebas en 6 archivos; build aprobado con aviso de tamaño del JavaScript. No son resultados ejecutados de nuevo para redactar este plan.

**F2-12 sigue pendiente:** commit deliberado de la entrega y comprobación de instalación/check/build y URLs desde un checkout limpio de ese commit. Los cambios actuales están preparados en el índice; eso no equivale a un commit ni autoriza a crearlo. Se puede avanzar en fase 3 sobre esta base conservando el pendiente, pero no declarar cerrada la fase 2. Para certificarla por separado, ejecutar F2-12 antes de mezclar implementación nueva; si se comprueba un commit posterior, registrar expresamente que contiene ambas fases.

## Análisis del punto de partida

| Área | Código actual | Trabajo necesario |
| --- | --- | --- |
| Secciones | `views` contiene etiquetas de revisión; no hay contenido público ni `usePortfolio` | Identificadores públicos, catálogo tipado y dueño único de selección |
| Presentación | `setCamera` y `setAnimation` son independientes | Comando que conserve cámara, acción y anclaje como una intención |
| Carga/reintento | Se conserva `activeView`; `selectAnimation` no guarda la solicitud sin escena y la recarga usa la animación real | Reaplicar la última intención completa, sin depender de eventos de reproducción antiguos |
| Cámara | Presets existentes, cambio inmediato y encuadre de Shot basado en pose | Reutilizar en fase 3; interpolación y aprobación visual en fase 4 |
| Render pausado | El bucle avanza únicamente con `playing` | La selección y el contenido deben funcionar pausados; no introducir esperas de cámara ni reanudación automática |
| Aplicación | En desarrollo abre siempre el visor; producción muestra escena y encabezado | Habilitar recorrido público verificable también en desarrollo |

## Alcance y decisiones de trabajo

Implementar coordinación, no construir todavía el diseño final de Home/Bio. Sin nuevas dependencias, router, gestor global, reexportación de assets ni cambios artísticos. Conservar R1–R7 y una sola escena por pantalla.

Adoptar como propuesta técnica hashes `#home`, `#bio`, `#projects`, `#experience`, `#contact`. Vacío o desconocido representa Home; normalizar con reemplazo, sin agregar una entrada ficticia al historial. Seleccionar otra sección agrega una entrada; seleccionar la actual no. Atrás/adelante actualizan el estado sin volver a escribir el historial. Cerrar solicita Home mediante el mismo camino que navegar.

Usar identificadores de sección `home`, `bio`, `projects`, `experience`, `contact`, independientes de las claves actuales de cámara. Mantener `Inicio` como clave técnica existente para evitar una migración gratuita. Las etiquetas públicas son inglesas.

| Sección | Cámara actual | Acción propuesta | Anclaje semántico propuesto |
| --- | --- | --- | --- |
| Home | Inicio | Recovery | ninguno |
| Bio | Bio | Dribble | seated |
| Projects | Projects | Crossover | seated |
| Experience | Experience | Standing | standing |
| Contact | Contact | Recovery | seated |

Estas asociaciones son valores iniciales configurables, pendientes de revisión artística con tarjetas reales en fase 4. En fase 3, el anclaje es solo un identificador tipado: sin coordenadas inventadas, proyección ni línea. Shot permanece en revisión; no se añade una interacción pública.

## Cómo ejecutar con Luna

Una tarea por turno, en orden y en el mismo árbol de trabajo. Leer `RULES.md` y revisar los cambios existentes antes de editar; conservar también lo preparado en el índice. No hacer commit, push ni despliegue. No avanzar automáticamente a otra tarea.

Prompt reutilizable:

> Ejecuta únicamente F3-XX de docs/tareas-fase-3.md. Lee RULES.md, la base heredada de fase 2 y las dependencias de la tarea. Conserva los cambios existentes. Implementa su alcance completo sin ampliar a fase 4 ni reescribir MotionPlayback. Ejecuta las comprobaciones indicadas y marca la tarea solo si cumple todos sus criterios. Registra evidencia breve y comunica archivos modificados, resultados y límites. No hagas commit, push ni despliegue ni avances a la siguiente tarea.

Cada tarea de código termina con `npm run check`. Añadir pruebas de comportamiento en las fronteras nuevas, sin duplicar los tests del reproductor ni probar copias de tablas estáticas. Reservar el build para F3-06 y F3-07 o cambios que lo justifiquen. Si falta evidencia, mantener la casilla abierta.

### F3-01 — Catálogo público y datos tipados

- [x] Completada.

**Dependencias:** base implementada de fase 2; F2-12 permanece como cierre de entrega independiente.

**Archivos previstos:** `src/content/portfolio.ts`, `sections.ts`, `scenePresets.ts`, `index.ts` y consumidores afectados.

Extraer presets sin cambiar valores; mantener los exports necesarios para el visor. Definir `SectionId`, catálogo exhaustivo y relación sección → presentación. Identidad confirmada: Yorman Castellanos / EL DIRTO; títulos de sección en inglés. No inventar cargo, biografía, proyectos, fechas ni contacto. Representar datos editoriales faltantes explícitamente, sin enlaces ficticios ni textos que parezcan definitivos. Solo datos en `content/`; tipos compartidos técnicos en `scene/types.ts` cuando proceda.

**Cierre:** cinco secciones exhaustivas, claves de cámara/atmósfera existentes, exportaciones del visor compatibles y datos pendientes identificados. Evitar `Record<string, ...>` para el catálogo público y conversiones forzadas que oculten claves inválidas.

**Evidencia:** se extrajeron presets a `scenePresets.ts`, se conservaron las claves, valores y exports del visor, y se añadieron identidad y catálogo exhaustivo en inglés con cámara, animación y anclaje tipados. Textos editoriales y enlaces faltantes se representan como `null`; no se inventó contenido profesional. `npm run check` aprobado: formato, lint, typecheck y 30 pruebas en 6 archivos.

### F3-02 — Comando coherente de presentación

- [x] Completada.

**Dependencias:** F3-01.

**Archivos previstos:** `src/scene/types.ts`, `src/scene/index.ts`, pruebas pertinentes.

Definir `ScenePresentation` y `setPresentation({ cameraId, motionId, anchorId })`. Validar identificadores antes de aplicar cambios, de modo que una intención inválida no cambie parcialmente la escena. Conservar la última intención antes de `load` y durante su espera; al terminar, aplicar la vigente sin recargar el modelo. El anclaje se conserva como dato para fase 4. Mantener `setCamera`, `setAnimation` y `seek` para revisión y la prioridad de encuadre Shot existente. No añadir una segunda cola de transiciones.

**Cierre:** una llamada actualiza el destino coherente; solicitudes sucesivas dejan vigente la última. Después de cargar, los cambios de acción usan `MotionPlayback.request`, conservando sus conectores y gates. No alterar su coreografía ni añadir interpolación de cámara.

**Pruebas:** intención anterior a carga, sustitución durante carga, secuencia rápida y rechazo sin aplicación parcial. Usar una frontera comprobable sin exigir WebGL en Node; no crear un framework de mocks del renderer.

**Evidencia:** `ScenePresentation` y `setPresentation` coordinan cámara, acción y anclaje. La intención pura conserva la solicitud más reciente antes de estar lista; el comando valida cámara, atmósfera, acción y anclaje antes de mutar estado y conserva los métodos de revisión existentes. `MotionPlayback.request` sigue siendo el único dueño de transiciones. `npm run check` aprobado: 35 pruebas en 7 archivos. No se añadió interpolación de cámara.

### F3-03 — Adaptar intención y reintento en useEnvironment

- [x] Completada.

**Dependencias:** F3-02.

**Archivos previstos:** `src/composables/useEnvironment.ts` y pruebas pertinentes.

Exponer una operación de presentación al coordinador. Conservar la intención completa aunque no haya instancia; enviarla a la instancia disponible y volver a aplicarla al reintentar. Inicializar desde esa intención y no desde `activeAnimation`, que es observación del estado real. Mantener los callbacks protegidos por generación, pausa, atmósfera y controles de revisión. Separar destino solicitado de estado reportado por el reproductor.

**Cierre:** seleccionar durante carga/error y luego reintentar lleva al último destino; callbacks de instancias anteriores no sobrescriben el estado vigente. Una sola instancia y un solo dueño del ciclo de vida. Pausar o tener movimiento reducido no impide enviar la selección ni reanuda el personaje automáticamente.

**Pruebas:** escena simulada en el límite del composable para carga diferida, fallo/reintento y callbacks obsoletos; preservar comprobaciones existentes.

**Evidencia:** `useEnvironment` mantiene `requestedPresentation` separado del estado observado por `onPlayback`; aplica la intención vigente al crear cada instancia antes de cargar, y conserva los métodos del visor actualizando una parte de la intención. Reintentar crea una instancia desde la acción solicitada y vuelve a aplicar cámara, acción y anclaje. Se añadió `presentationBridge` para conservar y aplicar la última solicitud; pruebas cubren selección antes de disponibilidad, actualización entre fallo/reintento y rechazo de una instancia obsoleta. `npm run check` aprobado: 38 pruebas en 8 archivos. No se probó la experiencia completa en navegador en esta tarea.

### F3-04 — usePortfolio como dueño de la selección

- [x] Completada.

**Dependencias:** F3-01 y F3-03.

**Archivos previstos:** `src/composables/usePortfolio.ts` y pruebas pertinentes.

Poseer sección seleccionada, tarjeta derivada (`null` en Home), datos visibles y acciones `selectSection`/`closeSection`. Comunicar presentación mediante el adaptador de entorno, sin crear otra escena. El cambio de contenido es síncrono e independiente de carga y reproducción. No mantener una segunda referencia mutable para la tarjeta ni derivar la sección desde `activeAnimation`.

**Cierre:** Home → Bio → Projects → Home conserva una única selección y emite la intención correspondiente. Cerrar desde cualquier sección vuelve a Home; seleccionar la actual es idempotente. No necesita WebGL para conservar y consultar contenido.

**Pruebas:** selección inmediata mientras el adaptador tarda, cierre y solicitudes rápidas; la última selección gana aunque el estado real siga en otra acción.

**Evidencia:** `usePortfolio` es dueño de la sección elegida, deriva la sección y tarjeta activa (Home no muestra tarjeta) y actualiza el estado antes de enviar la presentación al adaptador. Cerrar vuelve a Home y seleccionar la misma sección no emite una solicitud duplicada. Pruebas cubren selección inmediata, cierre, idempotencia y cambios rápidos de selección. `npm run check` aprobado: 42 pruebas en 9 archivos.

### F3-05 — Hash e historial

- [x] Completada.

**Dependencias:** F3-04.

**Archivos previstos:** `usePortfolio.ts`; extraer adaptación de URL solo si aclara una responsabilidad real.

Aplicar la política de hash de este plan: entrada directa, vacío, desconocido, selección repetida, cierre y atrás/adelante. Inicializar desde URL antes de enviar la primera presentación. Suscribir y retirar listeners con el ciclo de vida; prevenir escrituras recursivas y entradas duplicadas. No interceptar enlaces externos ni convertir el hash en un router general.

**Cierre y pruebas:** iniciar en `#experience` selecciona Experience durante la carga; atrás/adelante reproduce la selección sin agregar historial; hash inválido vuelve a Home mediante reemplazo; desmontar retira listeners. Comprobar la política con una historia simulada y luego en navegador en F3-07.

**Evidencia:** `usePortfolio` inicializa desde el hash, aplica la presentación de un enlace directo y normaliza vacío/desconocido a `#home` con `replaceState`. Las selecciones agregan historial y la misma sección es idempotente; `popstate`/`hashchange` actualizan estado sin reescribir entradas, con eventos duplicados ignorados y listeners retirados al desmontar. Pruebas con adaptador de historia simulado cubren entrada directa, normalización, selección, atrás/adelante, duplicados y limpieza. `npm run check` aprobado: 46 pruebas en 10 archivos. Falta el recorrido en navegador, registrado para F3-07.

### F3-06 — Integración pública mínima y acceso al visor

- [x] Completada.

**Dependencias:** F3-03 a F3-05.

**Archivos previstos:** `src/App.vue`, `src/components/PublicScene.vue`, componentes mínimos justificados y `README.md`.

Abrir la presentación pública por defecto también en desarrollo. Reservar `?review=1` para el visor, siempre condicionado a `import.meta.env.DEV` y con importación dinámica. Conectar una única instancia de `useEnvironment` y el coordinador público. Añadir navegación semántica mínima de las cinco secciones, estado seleccionado, título de sección y cierre para verificar el contrato. Etiquetas inglesas; controles disponibles durante carga y error. No construir aún tarjetas finales, contenido inventado, línea de anclaje o controles públicos de Shot.

**Cierre:** navegación accionable por teclado, Home sin tarjeta, selección y cierre verificables en la pantalla pública. El visor sigue funcionando en desarrollo; ninguna URL lo habilita en producción. Navegar no vuelve a montar el viewport ni recarga el GLB.

**Validación:** `npm run check`, `npm run build`, preview público y comprobación de ausencia del visor en producción. No presentar esta interfaz mínima como fase 4 completada.

**Evidencia:** la pantalla pública es la vista predeterminada tanto en desarrollo como en producción; `?review=1` abre el visor solo en desarrollo. Navegación semántica enlazada al catálogo, estado seleccionado, título y cierre funcionan durante carga y en vista lista; la portada no muestra tarjeta. En preview de producción se abrió Bio y se cerró a Home, se probó entrada directa en Experience y `?review=1` mantuvo la pantalla pública. En desarrollo, `/` abrió público y `/?review=1` abrió el visor técnico. El bundle de producción no contiene el componente ni etiquetas del visor. `npm run check` aprobado (46 pruebas en 10 archivos) y `npm run build` aprobado; se mantiene aviso por chunk JS de 755.44 kB. Revisión visual de escritorio a 1280×720; móvil y error/reintento integrado quedan para F3-07.

### F3-07 — Validación integrada y actualización del plan

- [x] Completada; evidencia registrada en [fase-3-validacion.md](fase-3-validacion.md).

**Dependencias:** F3-06.

Crear `docs/fase-3-validacion.md` y registrar resultados, entorno y limitaciones:

1. Entrada directa en Experience con carga lenta; elegir Bio y después Contact antes de terminar: selección inmediata y última intención aplicada al estar lista.
2. Home → Bio → Projects → Experience → Contact → cierre, incluyendo cambios durante Pickup/Rise. Confirmar una sola descarga de GLB por carga normal.
3. Atrás/adelante, selección repetida y hash desconocido, sin bucles de historial.
4. Fallo de carga y reintento conservando sección; usar copia temporal o interceptación local, sin fallos permanentes en producción.
5. Movimiento reducido: probado en la pantalla pública. La escena queda pausada y las selecciones responden con pose estable; la pantalla no expone una pausa manual independiente.
6. Escritorio y viewport estrecho, teclado, desmontaje y producción con `?review=1` inaccesible. **Comprobado:** viewport 390×844, navegación y tarjeta, cierre con Escape/foco, hash directo y producción con `?review=1`. Emulación no certifica rendimiento móvil.

**Cierre:** `npm run check` y `npm run build` aprobados; recorridos documentados sin regresiones materiales. Fase 3 queda completada en `plan-v3.md`; F2-12 continúa pendiente como cierre independiente de fase 2. La validación móvil emulada no certifica rendimiento físico. Para el estado actual de fase 4, revisar `plan-v3.md`.

**Evidencia:** `npm run check` aprobado (46 pruebas en 10 archivos) y `npm run build` aprobado. Navegador verificó enlace directo, recorrido de secciones, atrás/adelante, cierre con teclado, hash desconocido, fallback/reintento conservando sección y `?review=1` en producción. En 390×844, la tarjeta y navegación permanecieron disponibles. Una carga con 1,8 s de demora aceptó cambios a Bio y Contact antes de terminar; Contact quedó seleccionada tras la carga y hubo una sola solicitud del GLB en esa navegación. Con movimiento reducido activado, Bio y Experience respondieron sin iniciar reproducción ni dejar transición pendiente; se restauró la preferencia original. Ver [fase-3-validacion.md](fase-3-validacion.md).

## Orden y resultado esperado

F3-01 → F3-02 → F3-03 → F3-04 → F3-05 → F3-06 → F3-07.

Resultado: la sección cambia de inmediato, su intención llega de forma coherente a una escena persistente y se conserva en carga/reintento e historial. La fase 4 podrá construir Home + Bio sobre este contrato sin volver a resolver navegación ni reproducción.

F3-07 está cerrada. La implementación de fase 4 continúa según `plan-v3.md`.
