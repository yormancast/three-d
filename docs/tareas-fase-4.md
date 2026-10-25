# Fase 4 — Plan de cierre con Luna

21 de octubre de 2026. Análisis del árbol de trabajo actual, [plan-v3.md](plan-v3.md), [evidencia de fase 3](fase-3-validacion.md) y componentes públicos. Este documento es un plan; no certifica nuevas pruebas ni una revisión visual ejecutada al redactarlo.

## Diagnóstico

La fase 4 está avanzada. No corresponde reconstruir Home/Bio ni repetir la coordinación de fase 3.

| Área | Evidencia actual | Pendiente de cierre |
| --- | --- | --- |
| Identidad y navegación | `PortfolioIdentity`, `SectionNavigation` y `usePortfolio` disponibles | Revisar su convivencia con Bio completa |
| Tarjeta y teclado | `SectionCard` tiene título enfocable y cierre; `PublicScene` gestiona Escape y retorno a Home | Verificar foco con entrada directa, historial y contenido real |
| Contenido | Identidad personal Yorman Castellanos; el código usa incorrectamente EL DIRTO como firma; Bio tiene `body: null` y `links: null` | Obtener e incorporar biografía inglesa confirmada |
| Cámara y movimiento | Interpolación, anclaje proyectado y movimiento reducido constan implementados en el plan general | Validar el recorrido final sin rehacer el reproductor |
| Composición | El plan registra revisión a 1280×720 y 390×844 | Repetir con texto real; conservar rostro, manos y balón visibles |
| Resiliencia | Fase 3 registra carga lenta, fallo/reintento y navegación disponible | Comprobar legibilidad de Bio completa en esos estados |
| Espacio disponible | Tarjeta absoluta; no define altura máxima ni desplazamiento interno | Comprobar desbordamiento con texto, zoom y altura reducida; corregir si se reproduce |
| Conector | Geometría calculada desde Vue; actualización por selección, proyección y resize | Verificar unión al borde de tarjeta y actualización si cambia su tamaño |

Desviaciones visibles en el código respecto de las imágenes: `PortfolioIdentity` prioriza EL DIRTO® sobre el nombre; la tarjeta está abajo a la izquierda y su conector termina en `box.right`; la navegación de escritorio está abajo y tiene radios pequeños. Las referencias priorizan YORMAN C., tarjeta a la derecha con conexión a su borde izquierdo y navegación superior en píldora. No basta con conservar esos componentes: F4-00 debe corregir su jerarquía y composición. No se ha comparado aquí un render actual en navegador.

El plan general conserva textos desactualizados: la introducción y el próximo paso presentan fase 3 como trabajo futuro y la tabla describe fase 2 como parcial aunque su sección la declara completada. Corregir esas contradicciones al registrar el cierre; no reabrir fases por esas frases históricas.

## Dirección visual y objetivo obligatorios

Referencias inspeccionadas para este plan:

- [Web escritorio](direccion-de-arte/web-noche-escritorio.jpg): referencia principal de composición web.
- [Web móvil](direccion-de-arte/web-noche-movil.jpg): jerarquía y adaptación vertical.
- [Blender noche](direccion-de-arte/blender-noche.jpg): intención de iluminación, materiales y atmósfera; techo de calidad, sin exigir equivalencia del render web.
- [Dirección de arte](direccion-de-arte.md): tokens y reglas visuales complementarias. Las notas históricas sobre falta de Sit o GLB v10 no reabren trabajo de assets ya resuelto.

**Objetivo de la página:** presentar a Yorman como profesional, explicar qué hace y conducir a sus proyectos, trayectoria y contacto. La escena de básquet y el personaje aportan dirección artística y capacidad visual; Home debe permitir identificar a la persona y Bio debe comunicar una propuesta profesional concreta en pocos segundos. No cerrar la fase con una tarjeta que solo diga «Bio» o con el personaje presentado como identidad del sitio.

**Jerarquía de marca:** las tres imágenes muestran «YORMAN C.» arriba a la izquierda en hueso, grueso y ancho. Usar esa firma como marca principal visible y mantener «Yorman Castellanos» como nombre completo accesible/dato de identidad. DIRTO es exclusivamente el personaje, no la identidad principal ni secundaria del sitio. Por indicación explícita del usuario, retirar DIRTO / EL DIRTO del contenido editorial, firma, etiquetas y textos accesibles de la página. Su presencia gráfica dentro del escenario no lo convierte en marca del portafolio; esta corrección no exige modificar el GLB ni sus identificadores técnicos. El símbolo ® actual no aparece en las referencias: retirarlo del encabezado al reproducir esta dirección. No sustituir la marca por un logotipo genérico ni añadir sellos.

**Lenguaje visual:** Concrete & Acid, calle nocturna bajo el puente, hormigón y desgaste, morado profundo, hueso y acentos lima. Mantener la escena como fondo protagonista y una interfaz contenida. Archivo ancho 112–125 % y peso 800–900 en firma/titular; Archivo normal en cuerpo; JetBrains Mono en etiquetas, chips y navegación. Comprobar la fuente y variantes realmente cargadas; declarar un ancho no garantiza que se esté renderizando. Colores mediante tokens R7.

**Escritorio:** firma arriba a la izquierda y navegación en píldora arriba a la derecha, sección activa lima. Personaje al centro/izquierda y tarjeta a la derecha, sin tapar rostro, manos o balón. Línea lima fina desde un punto semántico del personaje al borde izquierdo de la tarjeta. Tarjeta carbón al 72 %, blur de 16 px, borde lima tenue y radio de 6 px; la navegación sí tiene contorno de píldora y activo redondeado. Reubicar controles para evitar colisiones con estados de carga/error.

**Móvil:** firma prominente arriba, personaje reconocible en la zona superior, tarjeta debajo y navegación en píldora al pie, sin conector. Adaptar proporciones al viewport; la imagen de referencia es alta y no obliga a comprimir toda la biografía dentro de un 390×844. Permitir desplazamiento accesible según F4-03 y conservar cierre/navegación alcanzables.

**Contenido de Bio:** etiqueta «01 — BIO», titular profesional destacado, párrafo breve de apoyo, chips de capacidades confirmadas y, si se confirma, ubicación. Las imágenes muestran una afirmación sobre frontend/3D, Venezuela/Chile, antigüedad y tecnologías: son contenido de maqueta, no hechos autorizados. Confirmarlos en F4-01. Si faltan ubicación, chips o enlaces, omitir esos elementos sin sustituirlos por relleno. El titular debe ocupar la jerarquía principal de la tarjeta; «Bio» es etiqueta de sección.

**Continuidad del recorrido:** la referencia muestra «Next: Projects →» y enlaces GitHub/LinkedIn/Email en escritorio. Reservar ese patrón para contenido/destinos confirmados y fase 5; no añadir un CTA a una tarjeta vacía. Mantener la navegación existente de cinco secciones y el cierre a Home por contrato funcional; la firma puede ofrecer retorno a Home con nombre accesible. El texto «Drag to look around» solo se incorpora si existe y se verifica esa interacción pública. No implementar controles o promesas por copiar una maqueta.

## Alcance

Cerrar el primer recorrido público Home → Bio → Home en inglés, con contenido confirmado y usable sin depender del render. Conservar R1–R7, escena persistente y cambios locales existentes. No añadir dependencias salvo necesidad demostrada. No ampliar Projects, Experience o Contact, incorporar Shot público, reexportar GLB ni optimizar recursos sin mediciones. La validación puntual de adaptación necesaria para leer Bio pertenece a este cierre; el rendimiento físico y la revisión de cinco secciones siguen en fase 6.

## Ejecución con Luna

Una tarea por turno, en orden y en este árbol. Antes de editar, leer `RULES.md` y revisar diferencias existentes: hay cambios locales de fases 3 y 4. No sobrescribirlos, descartarlos ni incluirlos en un commit. No hacer commit, push o despliegue ni avanzar automáticamente a la siguiente tarea.

Prompt reutilizable:

> Ejecuta únicamente F4-XX de docs/tareas-fase-4.md. Lee RULES.md, el diagnóstico y las dependencias de la tarea. Conserva los cambios locales existentes. Completa el alcance y registra evidencia verificable sin ampliar otras fases ni reescribir MotionPlayback. Si faltan datos editoriales, solicita solo los necesarios y continúa únicamente con trabajo independiente. No inventes información profesional. Marca la tarea solo cuando cumpla sus criterios; informa archivos, resultados y límites. No hagas commit, push ni despliegue ni avances a otra tarea.

Cada tarea con código termina con `npm run check`; build en la validación final o cuando el cambio lo requiera. Añadir tests solo para comportamiento nuevo o un fallo reproducible, sin duplicar tablas ni pruebas existentes. Para cambios únicamente documentales, verificar formato y coherencia de referencias; no atribuirles resultados de tests antiguos como si fueran nuevos.

### F4-00 — Alinear branding y estructura con las referencias

- [x] Completada el 21 de octubre de 2026.

**Dependencias:** base existente; no necesita esperar los datos biográficos.

**Archivos previstos:** `portfolio.ts`, `PortfolioIdentity.vue`, `PublicScene.vue`, `SectionNavigation.vue`, `SectionCard.vue`, tokens y carga de fuentes solo cuando sea necesario.

Aplicar la jerarquía y composición de la sección anterior: firma YORMAN C. como marca primaria, nombre completo accesible, navegación superior derecha en píldora para escritorio, tarjeta derecha y conector a su borde izquierdo; conservar adaptación inferior en móvil. Mantener Escape, retorno a Home y una escena persistente. Preparar separación tipada entre etiqueta y titular editorial, sin inventar el titular final. Sustituir `portfolio.wordmark` por YORMAN C. y retirar el símbolo ® del encabezado; no conservar EL DIRTO como subtítulo, alias editorial ni marca secundaria. Mantener Yorman Castellanos como nombre completo. Conservar rutas e identificadores técnicos de assets.

**Cierre:** DIRTO / EL DIRTO ausente del branding y contenido editorial/accesible de la interfaz; la identidad visible y accesible corresponde a Yorman. Capturas de estructura a 1280×720 y 390×844 comparadas con las referencias; firma, posición de navegación, forma de píldora, ubicación de tarjeta, tipografía y conector acordes. Registrar diferencias deliberadas por accesibilidad o viewport. `npm run check` aprobado; el texto final se valida después.

**Resultado:** revisión visual completada en navegador junto con F4-04. Home y Bio se capturaron en pantalla a 1280×720 y 390×844 y se compararon con las tres referencias. La interfaz muestra YORMAN C. como marca principal y conserva Yorman Castellanos como nombre accesible; DIRTO no aparece en los textos, etiquetas ni nombres accesibles de la página. Escritorio usa navegación en píldora arriba a la derecha, tarjeta a la derecha y línea al borde izquierdo; móvil conserva tarjeta inferior sin línea. Las capturas se inspeccionaron en navegador, pero no se exportaron a archivos. Las medidas y ajustes de Bio final constan en F4-04.

### F4-01 — Confirmar el contenido editorial

- [x] Confirmada el 21 de octubre de 2026.

**Dependencias:** ninguna; puede resolverse antes o después de F4-00. Es la entrada editorial indispensable. Confirmar una propuesta profesional breve que cumpla el objetivo descrito, además de decidir chips, ubicación y enlaces opcionales de la referencia.

Revisar los datos disponibles y solicitar al usuario el texto de Bio o los hechos necesarios para redactarlo en inglés: presentación/cargo que desea publicar, enfoque profesional y detalles personales que quiera incluir. Enlaces solo si desea mostrarlos y confirma su destino. No inferir trayectoria, años, clientes, ubicación ni especialidades del aspecto del personaje o del código. Identidad ya disponible: no volver a pedirla salvo corrección.

Preparar una propuesta inglesa basada exclusivamente en esos datos y obtener confirmación editorial antes de tratarla como definitiva. Si falta respuesta, dejar la tarea pendiente y avanzar con F4-03 sobre la estructura actual. No sustituir `null` por relleno publicable.

**Cierre:** texto exacto confirmado, procedencia de los datos registrada de forma breve y enlaces confirmados o decisión explícita de omitirlos. No es obligatorio añadir un cargo o enlaces para completar Bio.

**Confirmación editorial:** propuesta aprobada por el usuario el 21 de octubre de 2026, basada en `the-bunny-v1:src/components/threeD/threeD.vue` (Bio). Texto aprobado:

> **Full-stack developer focused on frontend and 3D**
>
> Born in Venezuela and now living in Chile, I’ve been coding for more than a decade, mostly in JavaScript. I’m technically a full-stack developer, but my passion is frontend and 3D. I love building with Three.js, from canvas animations to materials and UV mapping. I’ve also explored Python and C++.

Chips aprobados: JavaScript y Three.js. La propuesta se aprobó sin enlaces, así que Bio los omite. Se dejó fuera la certificación AWS que la versión antigua presentaba como pendiente.

### F4-02 — Integrar Bio en la capa de contenido

- [x] Completada el 21 de octubre de 2026.

**Dependencias:** F4-00 y F4-01.

**Archivos previstos:** `src/content/sections.ts`; `portfolio.ts` y tipos/consumidores solo si el contenido confirmado lo exige.

Incorporar el texto aprobado. Conservar `content/` como datos y evitar copiar textos dentro de componentes. El modelo actual admite una cadena; mantenerlo si basta. Si se necesitan párrafos independientes, definir un contrato tipado mínimo y renderizarlos semánticamente, sin HTML arbitrario. Conservar ausentes los enlaces no confirmados y las otras secciones pendientes.

**Cierre:** Bio pública contiene todo el texto aprobado en inglés, sin placeholders ni información inventada; Home conserva identidad y navegación. `npm run check` aprobado.

**Resultado:** título, párrafo y chips confirmados viven en `src/content/sections.ts`; `SectionCard.vue` los presenta desde esos datos. Enlaces y las demás secciones siguen vacíos.

### F4-03 — Asegurar lectura y teclado en espacio limitado

- [x] Completada el 21 de octubre de 2026.

**Dependencias:** F4-00. Puede adelantarse mientras se espera F4-01; repetir comprobación con F4-02 completada.

**Archivos previstos:** `SectionCard.vue`, `PublicScene.vue`, `SectionNavigation.vue` y estilos afectados, únicamente si se identifica un problema.

Comprobar tarjeta, navegación, título y cierre a 1280×720, 390×844, altura reducida y zoom de 200 %. Si el contenido excede el espacio, establecer límites de altura y desplazamiento accesible para mantenerlo alcanzable sin ocultar navegación o cierre. Usar texto temporal solo para probar, sin dejarlo incorporado. Mantener tarjeta inferior y ausencia de línea bajo 800 px; revisar 799/800 px para detectar inconsistencias locales, sin convertir esta tarea en la unificación global de fase 6.

Verificar Tab/Shift+Tab, apertura, Escape, botón de cierre, entrada directa en `#bio` y atrás/adelante. El foco debe ser visible y quedar en contenido al abrir y en Home al cerrar. La tarjeta actual es una sección: no añadir bloqueo de foco ni semántica de diálogo modal sin justificar un cambio de interacción.

**Cierre:** todo el texto y controles son alcanzables; sin recortes ni solapamientos que impidan uso. Registrar casos, resultados y correcciones. Tests de regresión solo si hay comportamiento corregido; `npm run check` si se modifica código.

**Resultados:** navegador local, viewport de 1280×720: Bio mide 465 px de alto, sin desplazamiento interno; titular y controles visibles. A 390×844, Bio mide 357 px, todo el texto y los chips caben, navegación inferior y sin conector. A 1280×480 y 390×480, la tarjeta limita su alto a 300 px y permite desplazamiento interno; el cierre y la navegación quedan visibles. Para el caso de zoom 200 % se usó el viewport equivalente de 640×360: la tarjeta limita su alto a 180 px y desplaza su contenido; el menú queda visible dentro del viewport. En 799 px la tarjeta y navegación quedan abajo y el conector no aparece; en 800 px ambos pasan a la composición de escritorio y el conector aparece. En cada tamaño el texto y el cierre fueron alcanzables.

Tab desde el titular llega al cierre; Shift+Tab llega a Contact. Abrir Bio con teclado y entrar directamente en `#bio` enfoca el titular con contorno lima visible. Escape y el botón de cierre vuelven a Home y enfocan Home. Atrás restaura Bio y su hash; adelante vuelve a Home. La preferencia de movimiento no se alteró.

**Corrección:** se hizo visible el foco programático del titular, se limitó el alto de la tarjeta según el viewport con desplazamiento interno y se redujo la altura mínima de la escena en pantallas móviles menores de 480 px para mantener la navegación a la vista. `npm run check` aprobado: 46 pruebas en 10 archivos.

### F4-04 — Revisar composición y conector con Bio final

- [x] Completada el 21 de octubre de 2026.

**Dependencias:** F4-02 y F4-03.

**Archivos previstos:** `src/content/scenePresets.ts`, `PublicScene.vue`, estilos de tarjeta; escena solo si hay un defecto técnico demostrado.

Revisar Home → Bio → Home a 1280×720 y 390×844 con el texto final. Confirmar rostro, manos y balón libres de texto; tarjeta a la derecha del personaje y conector unido a su borde izquierdo en escritorio. Comparar firma personal, jerarquía profesional de Bio, formas, tipografía y paleta con las imágenes; no limitar la revisión al encuadre 3D. Verificar que desaparezca sin anclaje visible y en móvil. Si el tamaño de tarjeta cambia sin resize de ventana, comprobar si el conector se actualiza; añadir observación de tamaño con limpieza de recursos solo si hace falta.

Conservar los encuadres revisados como punto de partida; ajustar únicamente lo necesario. Comprobar selección rápida Home/Bio, cámara con reproducción pausada y movimiento reducido con pose estable. No introducir otra cola de transiciones ni reanudar al personaje para mover cámara.

**Cierre:** capturas de Home y Bio en ambos tamaños, evidencia del recorrido y ausencia de superposición material. Registrar cualquier decisión visual aún pendiente del usuario. `npm run check` si cambia código. No marcar aprobación artística del usuario por una revisión técnica de Luna.

**Resultados:** se capturaron y revisaron Home y Bio en el navegador local a 1280×720 y 390×844. En escritorio la tarjeta Bio queda a la derecha (x=880, ancho 360 px, alto 466.7 px); el titular, párrafo y chips caben. La línea conecta el ancla proyectada con el borde izquierdo de la tarjeta (x=880, y=187.3; 30 px bajo su borde superior). La composición deja el rostro, manos y balón fuera de la tarjeta y del texto. Home no presenta conector; en Bio móvil tampoco aparece.

En 390×844, la tarjeta Bio queda abajo (x=12, y=410.9, ancho 366 px, alto 359.1 px). Se alejó y bajó el encuadre `Bio_mobile` para conservar el rostro, las manos y el balón encima de la tarjeta durante la pose de bote; el texto completo y los chips caben. La marca YORMAN C., titular profesional, navegación en píldora, tarjeta, tipografía y paleta mantienen la jerarquía prevista en las referencias. El texto editorial confirmado no se cambió.

La selección rápida Home → Bio → Home actualizó hash, contenido y sección activa sin desmontar la escena. En el visor de revisión se pausó el personaje y se seleccionó Bio: la cámara completó su transición, `data-playing=false` permaneció y el tiempo de animación se estabilizó en 1.47 s. Movimiento reducido: se conserva la comprobación registrada en [F3-07](fase-3-validacion.md), que observó Bio con `data-playing=false`, pose estable y sin transición pendiente; esta tarea solo cambió los presets de cámara y no alteró esa lógica. No se modificó la preferencia del sistema. El conector no necesita `ResizeObserver`: selección y resize de ventana vuelven a calcularlo, y cambiar solo el alto desplazable de la tarjeta no cambia su punto de unión.

**Ajustes de cámara:** `Bio` se desplazó a la izquierda para dejar margen al balón durante el bote en escritorio; `Bio_mobile` se alejó y desplazó arriba para separar por completo personaje y tarjeta. Las capturas de los cuatro estados se revisaron en navegador; no se exportaron como archivos de imagen. Revisión técnica únicamente; no implica aprobación artística del usuario.

### F4-05 — Validación integrada y cierre documental

- [x] Completada el 21 de octubre de 2026.

**Dependencias:** F4-00 a F4-04 completadas.

Crear `docs/fase-4-validacion.md` con fecha, estado del árbol/commit cuando corresponda, entorno, tamaños, resultados, capturas y límites. Ejecutar `npm run check` y `npm run build` sobre el estado final. Revisar en producción:

1. Home → Bio → Home, apertura/cierre por teclado, foco, hash e historial.
2. Entrada directa en Bio y selección durante carga lenta; una sola solicitud del GLB en carga normal.
3. Fallo de carga y reintento manteniendo Bio completa legible; ausencia de WebGL con contenido y navegación utilizables. Si no puede simularse un caso, dejarlo pendiente explícitamente.
4. Movimiento reducido, cámara capaz de completar el recorrido con personaje pausado y retorno a reproducción normal al restaurar la preferencia. Restaurar cualquier configuración del sistema modificada.
5. Escritorio, pantalla estrecha y casos de lectura de F4-03; conector solo en escritorio y sin errores de consola nuevos.
6. `?review=1` mantiene la pantalla pública en producción.
7. Comparativa visual con las tres referencias: marca personal primaria, titular profesional, píldora de navegación, tarjeta derecha/línea izquierda en escritorio y tarjeta inferior sin línea en móvil. Registrar por separado fidelidad visual y contenido confirmado; comprobar que se entiende quién es Yorman, qué hace y cómo continuar el recorrido.

Actualizar `plan-v3.md`: enlazar tareas y evidencia, conciliar introducción/tabla/próximo paso con estados documentados y marcar fase 4 completada solo con contenido confirmado y criterios verificados. Conservar pendientes de fases 5–7, avisos del build y límites reales. Si falta confirmación editorial, revisión visual requerida o una comprobación de cierre, mantener fase 4 en curso y nombrar el pendiente preciso.

**Cierre:** primer recorrido legible y accesible con contenido final, independiente del éxito del 3D, comprobaciones aprobadas y evidencia trazable. La emulación no certifica FPS ni rendimiento de un teléfono físico.

**Resultados (21 de octubre de 2026):** `npm run check` y `npm run build` aprobados en el estado final. El build genera la página pública; conserva el aviso de tamaño del chunk JavaScript de 759.14 kB (202.76 kB gzip) frente al umbral de 500 kB. En vista previa de producción, `/?review=1` muestra Home pública. Se comprobó Home/Bio, entrada directa por hash, Escape, foco, atrás/adelante, carga normal con una única solicitud del GLB, ausencia de avisos y errores de consola, y escritorio/móvil. Se retiró temporalmente el GLB del directorio de build para verificar el fallo de descarga: Bio siguió legible y el botón de reintento recuperó la escena al restaurar el archivo. Además, se ejecutó Chrome con WebGL y WebGL2 desactivados; la captura [Bio sin WebGL](evidencia/fase-4/no-webgl-bio.png) muestra el mensaje de escena no disponible, la acción de reintento, la Bio y la navegación pública utilizables. La prueba de carga lenta y selección durante carga consta en F3-07; movimiento reducido y cámara con reproducción pausada constan en F3-07 y F4-04.

Las capturas finales de producción están guardadas en [evidencia/fase-4](evidencia/fase-4/): Home y Bio en 1280×720 y 390×844, además del estado de Bio sin WebGL. Se revisaron visualmente y se compararon con las referencias. La fidelidad del render se verificó con Chrome headless y SwiftShader; la vista móvil también se inspeccionó en el navegador integrado, donde Archivo y el texto completo se ven sin recorte.

## Orden recomendado

F4-00 → F4-01 → F4-02 → F4-03 → F4-04 → F4-05. F4-03 puede iniciarse mientras se espera contenido y debe revisarse otra vez con el texto definitivo. Primera instrucción a Luna: ejecutar F4-00 para corregir la jerarquía de marca y composición. F4-01 puede resolverse en paralelo mediante conversación con el usuario; no reconstruir la coordinación de escena ya existente.
