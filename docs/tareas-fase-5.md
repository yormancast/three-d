# Fase 5 — Plan de implementación con Luna

22 de octubre de 2026. Plan basado en el árbol local, [plan general](plan-v3.md), [cierre de fase 4](fase-4-validacion.md) y código público actual. **Estado: F5-00–F5-07 completadas; F5-08 no adoptada.** La copia editorial queda provisional por decisión del usuario y Experience permanece vacía por decisión explícita.

## Objetivo y punto de partida

Completar Projects, Experience y Contact para que el recorrido de cinco vistas presente trabajo, trayectoria y una vía real de contacto de Yorman. Todo el contenido público se escribe en inglés y permanece utilizable si falla la escena.

La fase 4 consta completada. Reutilizar la escena persistente, `usePortfolio`, hash/historial, `SectionNavigation`, `SectionCard`, anclajes y presentación por sección. Projects y Experience ya tienen contratos de lista tipados, actualmente vacíos; Contact tiene cuerpo y enlaces tipados, también vacíos. Los presets existen; su composición con contenido final aún debe revisarse. `useEnvironment` ya expone `playing` y `togglePlayback`, pero la interfaz pública no ofrece pausa/reanudación.

Conservar R1–R7 de [RULES.md](../RULES.md), la identidad YORMAN C., Bio aprobada y dirección [Concrete & Acid](direccion-de-arte.md). Referencias: [escritorio](direccion-de-arte/web-noche-escritorio.jpg), [móvil](direccion-de-arte/web-noche-movil.jpg) y [atmósfera](direccion-de-arte/blender-noche.jpg). DIRTO identifica al personaje y a recursos técnicos; no se incorpora como marca o texto editorial.

## Alcance y decisiones de trabajo

- Una tarjeta abierta a la vez; cierre y Escape vuelven a Home. La selección actualiza contenido y hash inmediatamente, aunque el personaje termine una transición.
- Projects solicita Crossover con anclaje sentado; Experience, Standing con anclaje de pie; Contact, Recovery con anclaje sentado. Son presets iniciales sujetos a revisión visual, no aprobación artística.
- Proyectos como lista de casos breves dentro de la tarjeta; experiencia como lista cronológica; contacto como enlaces directos confirmados. Sin carrusel, modal de detalle, filtros, backend ni formulario de envío en esta fase.
- Incorporar pausa/reanudación pública accesible mediante el puente existente. Mantener el visor técnico exclusivo de desarrollo.
- **Shot público queda fuera del alcance base.** El plan general lo condiciona a una decisión de producto todavía pendiente. No añadir un botón de tiro ni considerar esa ausencia un bloqueo de cierre. Si el usuario lo solicita, ejecutar F5-08 antes de la validación final.
- Rendimiento físico, optimización de assets, unificación global de breakpoints, SEO y publicación permanecen en fases 6–7. Los ajustes locales necesarios para leer y usar las nuevas tarjetas sí pertenecen a fase 5.

## Ejecución con Luna

Una tarea por turno. Leer este documento, `RULES.md` y las diferencias locales antes de editar; hay trabajo previo sin commit. Conservarlo. No hacer commit, push, despliegue ni avanzar automáticamente a otra tarea. Sin dependencias nuevas salvo necesidad demostrada.

Prompt reutilizable:

> Implementa únicamente F5-XX de docs/tareas-fase-5.md. Revisa RULES.md, los archivos afectados y el diff actual. Conserva los cambios existentes y las capas. Usa datos confirmados; si falta información editorial, pregunta solo lo necesario y avanza únicamente con trabajo independiente. No inventes contenido ni marques pruebas que no ejecutaste. Comprueba los criterios de cierre, registra archivos cambiados, verificaciones y pendientes en esta tarea. No hagas commit, push ni despliegue. Detente al terminar F5-XX.

## Tareas

### F5-00 — Reunir y confirmar contenido editorial

- [x] Completada provisionalmente el 21 de octubre de 2026 con aprobación del usuario para reutilizar el texto de v1; revisión editorial completa aplazada.

**Dependencias:** ninguna. Bloquea la integración final de datos, no la preparación de componentes.

**Archivos:** este documento para el estado editorial; `src/content/` se modifica en F5-02 a F5-04.

Revisar primero el contenido local y la versión v1. No volver a pedir identidad ni Bio, que ya están aprobadas.

Recoger en una sola consulta los datos faltantes:

| Sección | Datos para publicar | Datos opcionales |
| --- | --- | --- |
| Projects | Nombre, qué resuelve, aporte personal y destino confirmado de cada enlace que se muestre | Tecnologías, fechas, imagen y resultado verificable |
| Experience | Organización o contexto profesional, cargo, fechas o intervalo aprobado y descripción del trabajo | Tecnologías y enlace público |
| Contact | Al menos una vía pública con destino exacto confirmado, por ejemplo email o perfil profesional | Texto de invitación y otras vías |

Proponer inicialmente 2–3 proyectos y una trayectoria breve; la cantidad definitiva depende del material confirmado. Un proyecto confidencial puede publicarse sin enlace si el usuario aprueba su descripción. No atribuir métricas, clientes, certificaciones ni fechas por inferencia. Si no se desean publicar empresas o fechas, obtener una alternativa editorial explícita; no rellenar con datos ficticios.

Registrar origen, alcance de la autorización provisional y destinos; no guardar conversaciones completas ni datos privados innecesarios. Los datos de prueba no deben quedar en el sitio público. La revisión editorial completa queda para después, conforme a lo que pidió el usuario; esta autorización permite cerrar la implementación técnica sin llamar final al texto.

**Hallazgos iniciales (21 de octubre de 2026):**

- `src/content/sections.ts` confirma que Projects, Experience y Contact siguen vacíos.
- `docs/reporte-as-is.md` describe el sitio anterior: no tenía una sección de proyectos ni experiencia comprobable; Contact sugería LinkedIn, pero el reporte no conserva una dirección verificable. No usar el texto antiguo como contenido actual.
- `origin/version-2:src/content/portfolio.ts` contiene textos de muestra sobre storefronts/configuradores 3D, un supuesto cargo de Frontend Technical Lead y disponibilidad para ciertos trabajos. Se consideran **no confirmados** y no se publicarán sin aprobación explícita.
- Ese mismo archivo contiene como destinos candidatos `https://github.com/yormancast` y `https://www.linkedin.com/in/yormancastellanos/?locale=en_US`, además del repositorio del proyecto. Son referencias históricas, no confirmación de que deban aparecer en el portafolio actual.
- No se encontró email ni información verificable de empresas, cargos, fechas o proyectos en el contenido disponible.

**Decisión editorial del usuario (21 de octubre de 2026):** “el texto que estaba en la v1 esta bien por ahora, luego los reviso todos”. Se interpreta como autorización para reutilizar provisionalmente los textos existentes de la v1 y revisar el conjunto más adelante. La fuente exacta es `origin/master:src/components/threeD/threeD.vue` (también presente en `origin/the-bunny-v1`):

- **Projects:** la v1 no tiene proyectos profesionales. Puede reutilizarse como caso histórico el contenido de “About this site”, rotulado como sitio/portafolio anterior para que sus referencias al conejo, Sketchfab y Tween.js no se presenten como tecnología actual. No inventar casos adicionales.
- **Experience:** no hay contenido de trayectoria en la v1; queda pendiente, sin completar con el supuesto cargo que aparece en la rama `version-2`, ya que no pertenece al texto de v1 ni tiene confirmación.
- **Contact:** reutilizar temporalmente el texto y el destino de LinkedIn que aparecen en la sección Contact de v1. Corregir la errata visible del nombre del enlace al presentar el mismo destino como “LinkedIn”; la redacción completa queda sujeta a la revisión futura acordada.
- **Excluir:** `Link 3` dice “I have no idea what to put here” y era un placeholder, no contenido editorial aprobado.

La copia provisional mantiene idioma inglés. Esta aprobación permite continuar la implementación, pero no equivale a revisión o aprobación final del portafolio completo. No existe texto de Experience en v1; la sección queda identificada como pendiente editorial para el cierre de fase.

**Cierre:** texto y enlaces aprobados para las tres secciones, o pendiente editorial identificado por sección. Sin Contact confirmado no puede cerrarse fase 5.

### F5-01 — Extender el contrato y la tarjeta por tipo de contenido

- [x] Completada el 21 de octubre de 2026.

**Dependencias:** F5-00 completada provisionalmente; la estructura puede implementarse con los datos pendientes.

**Archivos previstos:** `src/content/sections.ts`, archivos de datos adicionales si mejoran legibilidad, `src/components/SectionCard.vue` y componentes de contenido solo si son necesarios.

Definir contratos mínimos para proyectos y experiencia: identificador estable, título, descripción/aporte, datos opcionales y enlaces tipados. Mantener Home/Bio y consumidores existentes compatibles. Preferir una unión discriminada por sección si evita campos incoherentes; no crear un renderizador genérico de bloques ni CMS. Contact puede reutilizar el contrato de enlaces existente si basta.

Conservar `content/` como datos. La tarjeta es el contenedor común de título, cierre y foco; proyectos y experiencia se representan con listas, subtítulos y párrafos semánticos. Las fechas usan `<time>` solo si existe un valor válido; los intervalos editoriales siguen legibles. Sin HTML arbitrario. Los enlaces tienen nombres descriptivos; si se abren en otra pestaña, indicar ese comportamiento y usar la protección correspondiente.

**Cierre:** TypeScript representa cada sección sin `any`; listas vacías no generan entradas ficticias; Bio conserva texto, chips y comportamiento. `npm run check` aprobado. Esta tarea entrega estructura, no contenido final.

**Resultado:** `PortfolioSection` es una unión discriminada para Home, Bio, Projects, Experience y Contact. Projects define entradas con identificador, título, descripción, aporte opcional, tecnologías y enlaces; Experience define cargo, organización y periodo opcionales, descripción y tecnologías. `SectionCard` presenta proyectos y experiencia como listas semánticas y no renderiza la lista cuando está vacía. Contact conserva cuerpo/enlaces tipados y Bio mantiene párrafo/chips. Sin campos de datos inventados ni cambios en la coordinación de escena.

**Verificación:** `npm run check` aprobado el 21 de octubre de 2026: formato, ESLint, Stylelint, TypeScript y 46 pruebas en 10 archivos. No se añadieron pruebas; la tarea solo incorpora contratos de datos y renderizado declarativo.

### F5-02 — Completar Projects

- [x] Completada provisionalmente el 21 de octubre de 2026 con el texto aprobado de v1.

**Dependencias:** F5-01 y contenido de Projects aprobado en F5-00.

**Archivos previstos:** datos de proyectos en `src/content/`, presentación en `SectionCard.vue` o componente específico.

Incorporar los proyectos aprobados distinguiendo problema, contribución personal y enlaces disponibles. Mostrar tecnologías solo si están confirmadas. Omitir imágenes si no hay recursos adecuados; no producir miniaturas ni añadir descargas pesadas por defecto. Ordenar según lo acordado editorialmente.

**Cierre:** `#projects` ofrece casos comprensibles y enlaces con destinos comprobados; sin placeholders ni métricas inventadas. Los casos sin enlace se leen completos. Con más contenido del que cabe, toda la lista resulta alcanzable mediante desplazamiento y teclado. `npm run check` aprobado.

**Resultado:** se incorporó “Previous portfolio site” usando el texto existente de “About this site” en `origin/master:src/components/threeD/threeD.vue`. El contenido conserva su tono y referencias históricas, sin mezclarlo con afirmaciones sobre el sitio actual. Se extrajo el enlace de Sketchfab como enlace descriptivo, y se presentaron Three.js, Vue.js, Tween.js y Blender como tecnologías mencionadas por el texto. Sin proyectos ficticios; la revisión editorial sigue aplazada por decisión del usuario.

**Verificación:** `npm run check` aprobado el 21 de octubre de 2026: formato, ESLint, Stylelint, TypeScript y 46 pruebas en 10 archivos. La revisión visual de la tarjeta se hará en F5-06 con el recorrido completo.

### F5-03 — Completar Experience

- [x] Completada el 21 de octubre de 2026 como omisión editorial explícita del usuario.

**Dependencias:** F5-01; no se requiere contenido porque el usuario pidió dejar la sección vacía.

**Archivos previstos:** datos de experiencia en `src/content/`, presentación en la tarjeta o componente específico.

El usuario indicó “dejala vacia” el 21 de octubre de 2026. Mantener la sección y navegación existentes sin entradas, cargos, fechas ni texto inventados. Si después facilita trayectoria, revisar esta decisión editorial antes de incorporarla.

**Cierre:** Experience no presenta afirmaciones profesionales no confirmadas y queda vacía por decisión explícita. Reabrir solo si el usuario aporta contenido.

### F5-04 — Completar Contact y continuidad del recorrido

- [x] Completada provisionalmente el 21 de octubre de 2026 con contenido de v1 aprobado.

**Dependencias:** F5-01 y Contact aprobado; F5-02/F5-03 para añadir enlaces de continuidad a esas secciones.

**Archivos previstos:** datos de contacto y secciones en `src/content/`, `SectionCard.vue`, `PublicScene.vue` y `usePortfolio.ts` solo si el contrato lo exige.

Mostrar invitación breve y vías confirmadas. Email mediante `mailto:` si se aprueba; perfiles mediante sus URL exactas. No añadir formulario, copiar al portapapeles ni afirmaciones de disponibilidad laboral sin petición o datos que lo justifiquen.

Incorporar la continuidad prevista por las referencias cuando sus destinos estén completos: Bio → Projects → Experience → Contact. Declarar la relación en `content/` y enviar la selección a través de `usePortfolio`; sin una segunda lógica de hash ni manipulación de escena desde la tarjeta. Contact conserva el cierre a Home, sin necesidad de otro CTA. No duplicar todos los enlaces de contacto en Home si no ayuda a la composición.

**Cierre:** al menos una vía de contacto confirmada funciona; CTAs muestran destinos claros, actualizan selección/hash/foco por el flujo existente y no llevan a tarjetas vacías. Escape y cierre siguen regresando a Home. `npm run check` aprobado.

**Resultado:** Contact muestra la redacción de v1 con la errata del nombre del servicio corregida y el enlace LinkedIn del mismo origen. Bio → Projects → Experience → Contact quedó como continuidad declarada en `src/content/sections.ts`; cada CTA emite navegación al `usePortfolio` actual, que conserva hash e intención de escena. Experience sigue vacía conforme a la decisión del usuario, pero el CTA permite continuar el recorrido. Cierre y Escape se mantienen.

**Verificación:** `npm run check` aprobado el 21 de octubre de 2026: formato, ESLint, Stylelint, TypeScript y 46 pruebas en 10 archivos. La comprobación de recorrido visual queda para F5-06.

### F5-05 — Exponer pausa/reanudación pública

- [x] Completada el 21 de octubre de 2026.

**Dependencias:** ninguna editorial; puede adelantarse después de F5-01.

**Archivos previstos:** `PublicScene.vue`, un componente de control pequeño si resulta útil, `useEnvironment.ts` y escena solo ante un defecto demostrado.

Conectar un botón público a `playing` y `togglePlayback`. Etiqueta inglesa inequívoca, como “Pause animation” / “Resume animation”, foco visible y estado accesible coherente. Disponible cuando la escena está lista; ausente o deshabilitado de forma comprensible durante carga/error. Sin scrubber, selector de clips ni métricas del visor técnico.

Conservar pausa al navegar y reintentar; cambiar sección con el personaje pausado debe resolver una pose compatible y completar la cámara sin forzar reproducción. Comprobar la política existente de movimiento reducido y ocultación de pestaña: arranque reducido estable, reanudación solo por acción explícita cuando corresponda y retorno de pestaña sin deshacer una pausa manual. El botón no cambia preferencias del sistema. Corregir la coordinación en su capa si se reproduce un fallo.

**Cierre:** control usable con teclado en escritorio/móvil; la etiqueta refleja el estado público efectivo. Navegación y reintento conservan la intención del usuario. Tests de regresión si se corrige lógica de estado; `npm run check` aprobado.

**Resultado:** `PublicScene` expone Pause/Resume animation cuando la escena está lista, con etiqueta que refleja el estado y `aria-pressed`. La pausa no se activa ni se cambia durante carga/error; navegación y retry conservan el valor de reproducción que ya posee `useEnvironment`. El control queda en la parte superior izquierda, debajo de la identidad, sin exponer estadísticas o controles técnicos.

**Verificación:** navegador local, entrada directa en `#projects`; el árbol accesible cambió de Pause animation / pressed a Resume animation / not pressed. Se navegó a Experience y Contact mientras estaba pausada; el estado persistió. Reanudar cambió la etiqueta y estado accesible; cerrar Contact volvió a `#home` y enfocó Home. `npm run check` aprobado: 46 pruebas en 10 archivos. F5-06 registra la revisión de composición y secuencias completa.

### F5-06 — Revisar composición y transiciones del recorrido completo

- [x] Completada el 21 de octubre de 2026; se ajustó la altura de la tarjeta móvil para conservar visible el personaje en Projects.

**Dependencias:** F5-02 a F5-05 con contenido autorizado para esta entrega.

**Archivos previstos:** `src/content/scenePresets.ts`, estilos de tarjeta y componentes públicos; `scene/` solo si aparece un defecto técnico.

Revisar las cinco vistas a 1280×720 y 390×844, más 390×480, 1280×480 y zoom real 200 % cuando esté disponible. Si se usa viewport equivalente a zoom, documentar su límite. Comprobar borde 799/800 px sin ampliar la tarea a toda fase 6. Listas, enlaces largos, cierre, navegación y pausa deben quedar alcanzables sin desbordamiento horizontal. Usar contenido temporal extenso solo en pruebas y retirarlo.

Ajustar Projects, Experience y Contact con su contenido real. Mantener rostro, manos y balón fuera del texto tanto en reposo como durante Rise y retorno a la banca. Revisar la unión del conector al borde izquierdo cuando cambia el tamaño de tarjeta; añadir observación de tamaño con limpieza solo si se demuestra necesaria. En móvil no hay línea. No modificar Home/Bio sin evidencia de regresión o necesidad compartida.

Recorridos mínimos: Home → Bio → Projects → Experience → Contact → Home; Projects → Experience → Projects durante Rise; Experience → Contact → Bio durante retorno; varias selecciones rápidas terminando en Contact. Contenido/hash responden inmediatamente y la escena termina en la última intención compatible, sin duplicar la cola de `MotionPlayback`, recargar el modelo ni desmontar el canvas. Repetir con pausa manual y movimiento reducido.

**Resultado:** en móvil la tarjeta queda limitada a 48svh, con desplazamiento interno; en Projects el rostro permanece visible sobre el panel y el enlace y el CTA siguen alcanzables. El contenido no se modificó. Las cinco vistas se inspeccionaron en escritorio y móvil. Se recorrió Home → Bio → Projects → Experience → Contact → Home, las selecciones rápidas durante Rise/retorno y la navegación pausada; terminó en la última intención y el canvas siguió siendo único. La revisión es técnica, no una aprobación artística del usuario.

**Verificación:** revisión visual mediante capturas del navegador a 1280×720 y 390×844; métricas DOM en 390×480, 1280×480, 799/800×720 y 640×360 como viewport equivalente a zoom 200 %. Sin desbordamiento horizontal. En 390×480 el enlace Sketchfab y el CTA de Projects quedan visibles tras desplazar la tarjeta. `npm run check` y `npm run build` aprobados después del ajuste. Las capturas del navegador se mostraron durante esta tarea, pero el control de navegador disponible no ofreció una ruta para exportarlas al repositorio.

### F5-07 — Validación integrada y cierre documental

- [x] Cerrada el 22 de octubre de 2026 por decisión del usuario. Check/build, recorrido funcional y documentación completados; se aceptó no exportar capturas PNG al repositorio.

**Dependencias:** F5-00 a F5-06 completadas. F5-08 solo si se adopta Shot público.

Crear `docs/fase-5-validacion.md` y guardar capturas finales en `docs/evidencia/fase-5/`. Identificar fecha, estado local/commit, navegador, tamaños, resultados y limitaciones. Ejecutar `npm run check` y `npm run build` sobre el estado final; revisar el build servido en producción:

1. Cinco vistas, enlaces confirmados, CTAs, hashes directos, hash desconocido, atrás/adelante, foco, Tab/Shift+Tab, Escape y cierre.
2. Selección rápida durante Rise y retorno; pausa/reanudación y cámara con personaje pausado. Un canvas persistente. La inspección del flujo `useEnvironment` confirma que `playing` se conserva y se vuelve a aplicar al crear cada instancia durante un reintento; la interacción completa desde la UI no se pudo disparar con el control oculto en error y sin interceptación/pérdida de contexto expuesta por el navegador. Movimiento reducido se referencia desde la validación F4; esta sesión no permitió emular de nuevo la preferencia.
3. Se sirvió una copia temporal del build con el GLB apartado. Projects, Experience y Contact conservaron texto, navegación y enlace; al restaurar el GLB y elegir Try again, la escena recuperó estado `ready` en `#contact`. La copia se restauró. La prueba sin WebGL se referencia desde F4; en F5 se comprobó el fallback con fallo de carga del GLB.
4. Composición, desplazamiento y navegación de F5-06; cero errores/avisos de consola en producción.
5. `?review=1` mostró la interfaz pública en Projects. La preferencia de viewport se restauró al tamaño normal.

Actualizar `plan-v3.md`, enlazar validación y conciliar el estado de fase. Check/build y la validación integrada están aprobados. Se documenta que las capturas se revisaron en el navegador pero no se exportaron como PNG; el usuario aceptó cerrar sin esos archivos. El texto provisional de v1 se conserva según lo autorizado, con revisión editorial posterior.

**Cierre funcional:** cinco vistas utilizables con el contenido autorizado, navegación resiliente y control público de reproducción; check/build aprobados y estado documental coherente. F5-07 queda cerrada por decisión del usuario, aceptando la ausencia de PNG exportados. No implica publicación, rendimiento en móvil físico ni cierre de fases 6–7.

### F5-08 — Opcional: Shot público, solo si el usuario lo solicita

- [x] No adoptado; permanece fuera del alcance base, sin solicitud del usuario.

**Dependencias:** solicitud explícita y F5-05. Ejecutar antes de F5-07 si se activa.

Reutilizar Shot existente desde una acción explícita de Home, sin asociarlo automáticamente a una sección. La cámara de tiro tiene prioridad hasta recuperar el balón; las tarjetas/hash cambian al seleccionar y la escena atiende luego la última sección solicitada. Mantener aro y trayectoria visibles. Definir y comprobar disparos repetidos, pausa durante el tiro, movimiento reducido y reintento, sin otra cola en Vue ni creación de clips. Añadir regresiones sobre el comportamiento modificado y evidencia visual en escritorio/móvil.

**Cierre condicional:** recuperación completa y destino final coherente, controles accesibles, ausencia de bloqueos y validación integrada repetida. Si no se solicita, registrar “no adoptado” al cerrar la fase y mantener Shot en revisión técnica.

## Orden recomendado y entrega a Luna

F5-00 → F5-01 → F5-02 → F5-03 → F5-04 → F5-05 → F5-06 → F5-07. F5-03 queda completa con Experience vacía por decisión explícita. La revisión editorial posterior puede reabrir F5-00, F5-02 o F5-04 si el usuario quiere cambiar los textos o datos.

**Estado de entrega:** F5-00–F5-07 completadas; F5-08 no adoptada y fuera del alcance base. La conservación de pausa durante reintento se verificó en el flujo de estado. El contenido de v1 sigue sujeto a la revisión posterior que pidió el usuario. No reconstruir coordinación, reproductor ni recursos ya resueltos.
