# Fase 6 — Móvil, carga y rendimiento

22–24 de octubre de 2026. Plan basado en el árbol local y el [cierre de fase 5](fase-5-validacion.md). **Estado: F6-00 completada; F6-01 y F6-02 implementadas con revisión visual parcial; F6-03 integrada con recuperación comprobada, pendiente WebGL deshabilitado y preservación de pausa previa al fallo; F6-04 optimizada y adoptada; F6-05 dividió el bundle, sin repetir aún el protocolo de rendimiento; F6-06 validó el recorrido funcional de producción, con matriz visual pendiente; F6-07 parcial, sin móvil físico ni medición final de cuadros. La fase permanece abierta.** Ver [validación de fase 6](fase-6-validacion.md).

## Objetivo y límites

Hacer utilizable el portafolio completo en pantallas estrechas, orientación horizontal y condiciones de carga adversas; medir el coste real de la escena y optimizar donde haya evidencia. Conservar las cinco vistas, la escena persistente, la dirección artística y las capas de [RULES.md](../RULES.md).

La revisión editorial sigue pospuesta y Experience permanece vacía por decisión del usuario. Shot se revisa en el visor de desarrollo; no se incorpora a la UI pública. SEO y publicación corresponden a fase 7. No reabrir F5 por la ausencia de PNG que el usuario ya aceptó.

## Hallazgos de partida

- `scene/index.ts` usa `width < 700` para calidad móvil y presets móviles solo en vertical; la UI y el conector usan 800 px. El intervalo 700–799 combina tarjeta móvil con render de escritorio.
- El DPR está limitado a 1 en móvil y 1,25 en escritorio; el postproceso desactiva profundidad de campo y reduce bloom en móvil. Son ajustes existentes, no rendimiento demostrado.
- `SectionCard.vue` ya limita la tarjeta móvil a 48svh y permite scroll interno. Navegación y tarjeta consideran el área segura inferior, pero falta revisar el conjunto en horizontal, con texto ampliado y áreas seguras laterales/superiores. El viewport todavía no declara `viewport-fit=cover`.
- `SceneStatus.vue` muestra progreso determinado; `useEnvironment` convierte recursos completados a porcentaje y `loadSceneAssets` no comunica bytes. Ese porcentaje no representa la descarga del GLB.
- El GLB documentado ocupa 15.449.252 bytes y las tres texturas del balón, 8.287.215 bytes. Reconfirmar tamaños e inventario al medir.
- F5 registró 762,63 kB de JavaScript principal (203,91 kB gzip). `submissionMs` mide trabajo de envío desde CPU, no tiempo de GPU ni FPS.
- F4/F5 aportan pruebas de fallback, navegación y composición. No aportan mediciones de un móvil físico ni sustituyen la validación final de F6.

## Ejecución

Una tarea por solicitud; al implementar, conservar las diferencias locales existentes. No crear commit, push ni despliegue. Registrar resultados reales y límites por tarea. No añadir dependencias sin necesidad demostrada. Usar pruebas de regresión cuando cambie lógica, revisión visual para composición y `npm run check` en los cambios; ejecutar también build cuando afecte a la entrega.

Prompt reutilizable:

> Implementa únicamente F6-XX de docs/tareas-fase-6.md. Lee RULES.md y el diff actual. Conserva el trabajo previo y las capas. Cumple los criterios de cierre, registra verificaciones y límites sin atribuir pruebas no ejecutadas. No hagas commit, push ni despliegue. Detente al terminar F6-XX.

## Tareas

### F6-00 — Registrar la línea base y el protocolo

- [x] Completada el 22 de octubre de 2026 en MacBook Air M3 con Chrome 155.

**Archivos:** nuevo `docs/fase-6-validacion.md`; evidencia en `docs/evidencia/fase-6/` cuando pueda guardarse.

Medir el build de producción antes de optimizar. Identificar estado del árbol/commit, fecha, equipo, CPU/GPU/RAM cuando sean accesibles, sistema, navegador/versión, viewport, DPR, red, caché y alimentación. Elegir un portátil y un móvil físico representativos; si no están disponibles, avanzar con mediciones locales e identificar la prueba física pendiente. La emulación de viewport o CPU no demuestra rendimiento de móvil físico.

Separar navegación hasta póster visible, HTML utilizable y primer frame 3D visible. Usar marcas, traza o captura temporal verificable: `ready` por sí solo no garantiza un frame presentado. Registrar descarga del GLB, bytes transferidos/tamaño del recurso, parseo/preparación cuando sea medible y tiempo total. Para cargas frías hacer al menos tres ejecuciones y registrar valores y mediana; separar caché caliente. Definir el perfil de red antes de comparar.

Tras calentamiento, medir intervalos de frame durante 30 s por vista y un recorrido con Rise/retorno; reportar FPS observado, p95 del intervalo y pausas relevantes. No calcular FPS desde `submissionMs`. Registrar memoria JS e inventario de geometrías/texturas cuando estén disponibles, distinguiendo conteos, estimaciones y memoria real de GPU. Marcar métricas no expuestas como no disponibles.

**Cierre:** línea base reproducible y condiciones explícitas. Metas heredadas: aproximadamente 60 FPS en portátil medio y al menos 30 FPS en móvil medio; primera imagen visible en menos de 2 s bajo el perfil registrado. Distinguir póster de escena interactiva; informar ambos tiempos y no presentar el póster como carga 3D completada.

**Resultado:** `npm run build` aprobado; bundle principal 762,63 kB/203,91 kB gzip; GLB 15.449.252 bytes y texturas del balón 8,28 MB. Tres recargas sin caché en localhost dieron 220–289 ms de navegación y 44–45 ms para el GLB. Se muestrearon intervalos de cuadro durante 30 s en las cinco vistas, un recorrido con Rise/retorno y Home en viewport estrecho. En 1200×558 los resultados fueron 25,0–31,5 FPS; en 645×858, 44,9 FPS. DevTools estuvo abierto; no se presentó el tiempo de recurso como tiempo de primer frame. Móvil físico queda pendiente para F6-07.

### F6-01 — Coordinar layout, calidad y orientación

- [ ] Parcial. **Dependencia:** F6-00. Implementación, pruebas de clasificación y build terminados el 24 de octubre; falta la revisión visual de la matriz de viewports.

**Archivos previstos:** `PublicScene.vue`, componentes de identidad/navegación/tarjeta, `useEnvironment.ts`, configuración en `content/`, contratos y selección de perfil en `scene/`; `index.html` si se requiere cubrir áreas seguras.

Usar 800 px como límite de layout compartido. Definir una fuente coherente para CSS y el puente; la escena recibe configuración por parámetro, sin importar contenido ni estilos del DOM. Evitar otra cifra independiente en el conector o el visor. Separar explícitamente layout estrecho, orientación y calidad: una pantalla ancha no prueba capacidad de GPU. Mantener la calidad actual como punto de partida y ajustar solo con evidencia de F6-00.

Revisar presets en horizontal y al rotar con una tarjeta abierta, también en pausa. Cubrir áreas seguras en los cuatro bordes y barras del navegador; verificar el efecto de `viewport-fit=cover` si se incorpora. Mantener el canvas único y el estado de sección/reproducción al redimensionar.

**Cierre:** revisar 699/700 y 799/800 px, 390×844, 844×390, 390×480, 1280×480 y 1280×720. Sin cambio contradictorio de UI/cámara, superposiciones de controles ni pérdida de selección al rotar. Regresión de la selección de perfil si se extrae lógica.

**Resultado parcial:** el breakpoint de 800 px ahora proviene de una configuración compartida para UI y puente de escena. Layout compacto, orientación y perfil de calidad se calculan por separado; el perfil usa ancho, alto y puntero grueso. `viewport-fit=cover` y áreas seguras se aplican a las superficies públicas y de revisión. `npm run check` aprobó 49 pruebas y `npm run build` aprobó; la inspección visual disponible en 1200×558 confirmó las cinco opciones de navegación, Bio abierta y escena visible. La matriz restante (699/700, 799/800, retrato, horizontal y alturas extremas), la rotación con estado conservado y la pausa durante giro siguen pendientes; no se da por acreditado el cierre visual.

### F6-02 — Asegurar lectura y controles en espacio reducido

- [ ] Parcial. **Dependencia:** F6-01; se avanzó mientras sigue pendiente su matriz visual.

**Archivos previstos:** `SectionCard.vue`, `SectionNavigation.vue`, `PortfolioIdentity.vue`, `PublicScene.vue` y tokens si hacen falta.

Revisar las cinco vistas con texto actual, zoom real al 200 %, ampliación de texto y contenido temporal extenso/enlaces largos. Retirar los datos de prueba al terminar. Revisar también 320 px de ancho. Ajustar altura, espaciado y scroll según el espacio realmente disponible; no imponer que 48svh sirva para toda orientación.

El cierre, enlaces, CTA, navegación y pausa deben ser alcanzables con tacto y teclado. Mantener foco visible y permitir llegar al elemento enfocado dentro de paneles desplazables. Revisar tamaños táctiles y separación; conservar rostro, manos y balón visibles donde el espacio permita la composición aprobada, priorizando lectura y acceso en alturas extremas.

**Cierre:** sin desbordamiento horizontal de página ni contenido inaccesible. El scroll interno llega a los últimos controles. Documentar si el navegador solo permite viewport equivalente a zoom; esa prueba no acredita zoom real ni ampliación de texto.

**Resultado parcial:** la tarjeta ya ocupa el espacio disponible entre pausa y navegación en layout compacto, sin un límite fijo de 48svh. Títulos, párrafos y enlaces largos pueden partir líneas; el scroll reserva margen para el foco. Navegación, pausa, cierre, enlaces y avance tienen un mínimo táctil de 44 px, y los tamaños de texto de controles usan `rem`. `npm run check` aprobó 49 pruebas y `npm run build` aprobó. En la revisión de producción a zoom real del navegador de 200 %, Bio permaneció legible dentro de una tarjeta desplazable. La comprobación de teclado se interrumpió al cambiar Chrome de sección; quedan por verificar la llegada al último control, 320 px, las cinco vistas, texto ampliado y contenido temporal largo/enlace extenso. No se usaron ni quedaron datos temporales de prueba.

### F6-03 — Mostrar carga honesta y comprobar recuperación

- [ ] Parcial. **Dependencias:** F6-01 y F6-02. Indicador indeterminado, guardas asíncronas y recuperación por fallo comprobados; faltan WebGL deshabilitado y reintento con pausa previa.

**Archivos previstos:** `SceneStatus.vue`, `useEnvironment.ts`, `SceneConfig`, llamadas de progreso en `scene/index.ts`, consumidores públicos y de revisión; `assets.ts` solo si se adopta progreso real.

Preferir indicador indeterminado accesible mientras no exista progreso por bytes fiable. Si se implementa progreso real, mostrar porcentaje únicamente con total conocido y distinguir descarga de preparación; no indicar finalización antes de la escena lista. Mantener inglés público y compatibilidad del visor técnico.

Validar producción con red lenta, GLB fallido, reintento tras restaurarlo y WebGL deshabilitado realmente. Comprobar navegación y enlaces durante esos estados, sin que el panel tape controles. Repetir reintento conservando sección y una pausa previa; verificar movimiento reducido, vuelta de pestaña oculta y ausencia de bucles de render innecesarios en pausa. La preferencia de reproducción no debe perderse.

**Cierre:** contenido y navegación utilizables en todos los estados; reintento recupera la última intención con un canvas, sin cargas obsoletas que alteren el estado. Pruebas de regresión sobre lógica modificada. Si una herramienta no permite inducir un caso, registrarlo pendiente y no sustituirlo por inspección de código como si fuera prueba integrada.

**Resultado parcial:** `SceneStatus` ya no convierte la cuenta de recursos en un porcentaje de descarga; anuncia una carga indeterminada y admite etiquetas en inglés para el visor. Se retiró el callback de progreso falso. Check/build aprobados con 56 pruebas. En una copia aislada de producción se quitó el GLB: el contenido Contact, navegación y botón de reintento siguieron visibles. Tras restaurar el archivo, reintentar cargó la escena y conservó `#contact`; la reproducción, activa en esa ejecución, volvió a activarse. No se probó un fallo que ocurriera después de pausar ni se deshabilitó WebGL realmente; tampoco se repitieron movimiento reducido y retorno desde pestaña oculta. No se marca el cierre completo.

### F6-04 — Evaluar y optimizar las texturas del balón

- [x] Completada el 24 de octubre. **Dependencias:** línea base F6-00 y protocolo de comparación.

**Archivos previstos:** variantes temporales del GLB, distribución activa solo si se adopta una variante, README e inventario de assets.

Inspeccionar dimensiones, formatos y función de las tres texturas. Comparar primero reducción de resolución y compresión compatible con el pipeline actual. Evaluar otro formato solo si su ahorro justifica decodificador, complejidad y compatibilidad. Conservar la entrada original y trabajar en candidatos separados; no ejecutar optimización general sobre el único original.

Comparar tamaño, tiempo de carga y memoria estimada/observable con las mismas condiciones de F6-00. Revisar balón de cerca, iluminación, morphs, pistas de Ball, clips y `motionData`; comprobar el contrato del recurso y reproducción completa. No reducir geometría ni alterar animaciones para compensar un problema de texturas sin evidencia.

**Cierre:** adoptar la variante solo si hay beneficio medido y calidad aceptable documentada; también es válido conservar el recurso con una comparación que lo justifique. Si cambia, actualizar tamaños, hashes, contrato/inventario y las copias activas según su política, ejecutar tests del recurso, check y build, y repetir revisión visual. No exigir un porcentaje de ahorro inventado.

**Resultado:** se redujeron las texturas del balón de 2048×1024 a 1024×512, sin cambiar los cinco mapas WebP del entorno. El candidato validó el contrato de los siete clips y se cargó en el build; la vista Projects a 1280×720 mostró el balón y la escena sin degradación visible frente al original. GLB activo: 9.414.840 bytes (−6.034.412 bytes; −39,1 % respecto de la línea base F6-00), SHA-256 `a65517b2c8108d5a7fcbbe7ff6735070323de05d2f4035d9670dd3341084b1dc`. La suma informada de las texturas del balón bajó de 8,29 MB a ~2,50 MB; la estimación de memoria de GPU, de 33,54 MB a 8,39 MB. Son estimaciones del inspector, no memoria física medida. Los clips y morph targets pasan `motionAssets.test.ts`; no se cambiaron geometría ni duración. La entrada local ignorada sigue siendo el GLB original para conservar la exportación fuente; la distribución pública optimizada es la que usa el build. `check` (56 pruebas) y `build` aprobados. El inspector marca las mismas advertencias existentes de tangentes generadas y extensión Meshopt no compatible con su validador; no reporta errores.

### F6-05 — Corregir el cuello de botella demostrado

- [ ] Parcial. **Dependencias:** F6-00 y F6-04. Se aplicó división dinámica del motor porque el bundle de entrada superaba 500 kB; falta comparar tiempos de disponibilidad/primer frame bajo las condiciones F6-00.

**Archivos:** solo los que identifique la medición; posibles `useEnvironment.ts`, entrada de revisión, render/postproceso y configuración de calidad.

Si la línea base lo exige, evaluar carga diferida del motor desde el composable para adelantar HTML/póster, coste del visor de desarrollo en producción, DPR/postproceso o trabajo por frame. La división de JavaScript puede mejorar disponibilidad del contenido sin reducir el tiempo total del 3D: medir ambos. Mantener protección de generación y desmontaje si aparecen imports asíncronos. Una variante ligera se considera únicamente si las mejoras previas no bastan y existe evidencia.

Aplicar cambios acotados y comparar antes/después bajo condiciones iguales. No crear selección automática de calidad ni otro GLB por intuición. No exponer métricas técnicas en la UI pública.

**Cierre:** beneficio medido sin regresiones funcionales o registro razonado de que no se necesita otro cambio. Si no se alcanzan las metas, registrar el resultado y el siguiente ajuste pendiente; no declarar rendimiento aprobado por desaparecer el aviso de tamaño del bundle.

**Resultado parcial:** `createScene` se carga al iniciar la escena mediante import dinámico, con guardas de generación y desmontaje antes de crear el renderer. El chunk inicial pasó de 763,17 kB (204,06 kB gzip) a 83,40 kB (32,28 kB); se genera un chunk del motor de 680,60 kB (172,14 kB gzip). El total transferido comprimido queda aproximadamente igual, distribuido en dos solicitudes, y Vite sigue avisando que el chunk del motor supera 500 kB. No se midió el momento de HTML interactivo ni el primer frame con repeticiones frías; por ello, la reducción de entrada no se presenta como mejora acreditada de tiempo total de carga.

### F6-06 — Validar composición y comportamiento finales

- [ ] Parcial. **Dependencias:** F6-01–F6-05 resueltas en implementación; quedan validaciones visuales y de entorno.

Revisar el build final en la matriz de F6-01 y los casos de F6-02/F6-03. Recorrer Home → Bio → Projects → Experience → Contact → Home, selecciones rápidas durante Rise/retorno, pausa y reanudación, movimiento reducido, rotación, pestaña oculta y fallback. Confirmar hash/foco, última intención y canvas persistente.

Revisar Shot y recuperación en el visor de desarrollo en vertical/horizontal, conservándolo fuera del sitio público. Revisar el sitio de producción por separado y confirmar que `?review=1` no habilita controles técnicos. Guardar capturas locales cuando la herramienta lo permita; registrar ubicación real o limitación, sin atribuir archivos inexistentes.

**Cierre:** matriz funcional/visual registrada sobre el estado final, defectos corregidos o pendientes identificados. No tratar una inspección técnica como aprobación artística del usuario.

**Resultado parcial:** el build final recorrió Home → Bio → Projects → Experience → Contact → Home; cada selección actualizó el hash y mantuvo la navegación. La pausa permaneció activada al recorrer Bio y Contact. En producción, `?review=1` no expuso controles técnicos. El candidato optimizado cargó en Projects y el balón se mantuvo visible. No se completó la matriz de tamaños/orientación, rotación, zoom/texto ampliado, Shot en el visor de desarrollo, movimiento reducido ni pestaña oculta; no se guardaron capturas en el repositorio. Esto acredita el recorrido funcional observado en Chrome de escritorio, no la composición final móvil.

### F6-07 — Repetir mediciones y cerrar la fase

- [ ] Parcial. **Dependencia:** F6-06. Check/build finales aprobados; repetición completa de métricas físicas y visuales pendiente.

Ejecutar `npm run check` y `npm run build`; repetir el protocolo en portátil y móvil físico sobre la entrega final. Comparar con la línea base, incluyendo cargas frías/calientes, frames, memoria disponible y varias recuperaciones de carga para detectar crecimiento sostenido. Registrar dispositivo y condiciones; la falta de métricas de GPU no se reemplaza con memoria JS.

Completar `docs/fase-6-validacion.md` con resultados, evidencia, cambios adoptados/rechazados y limitaciones; actualizar este documento y `plan-v3.md`. Mantener separadas implementación, pruebas de navegador y mediciones físicas. Si falta móvil físico o no se cumplen metas, indicar exactamente qué queda abierto; no cerrar por tener check/build aprobados.

**Cierre:** interfaz final usable, recuperación validada y resultados reproducibles registrados en portátil y móvil. Metas cumplidas o desviaciones aceptadas explícitamente por el usuario. Sin publicación ni cambios editoriales implícitos.

**Resultado parcial:** `npm run check` pasó (11 archivos, 56 pruebas) y `npm run build` pasó. Bundle inicial 83,40 kB/32,28 kB gzip; chunk de motor 680,60 kB/172,14 kB gzip. GLB público 9.414.840 bytes. No se repitieron las tres mediciones frías, el cuadro por vista durante 30 s, caché caliente, memoria ni navegación bajo red definida en F6-00. No hay móvil físico disponible en esta sesión. La fase sigue abierta hasta completar las verificaciones identificadas; no se declara aprobada por check/build.

## Orden recomendado

F6-00 → F6-01 → F6-02 → F6-03 → F6-04 → F6-05 → F6-06 → F6-07. Las mediciones físicas pueden requerir colaboración del usuario; esa dependencia no impide completar ajustes y evidencia local, pero permanece visible hasta el cierre.

## Continuación de validación — 25 de octubre

Durante la preparación de entrega se corrigieron los selectores y el layout móvil; se completaron 50 combinaciones de vista/tamaño sin desbordamiento horizontal, prueba aislada de contenido extenso, reintento del GLB en 320 px, acceso por teclado y giro equivalente conservando pausa. Se revisó Shot/retorno en desarrollo. Check/build aprobaron con 59 pruebas. Ver [evidencia y pendientes precisos](fase-7-validacion.md). No se cierran los ítems parciales: conservan casos de entorno, zoom/ampliación final, rendimiento y móvil físico aún no acreditados.

## Recuperación y mediciones posteriores — 25 de octubre

Se corrigió una pérdida real de contexto que dejaba la escena en ready sin reintento. La recuperación con canvas nuevo conserva sección y pausa, y pasó tres ciclos reales. Movimiento reducido, zoom real y pestaña oculta también fueron comprobados. Hay 61 pruebas aprobadas y una instalación independiente con check/build aprobados. Las muestras de 30 s quedaron en 23–30 FPS; el candidato sin MSAA se rechazó por dientes de sierra. Móvil físico, WebGL inicial deshabilitado, primer frame GPU, memoria aislada y la desviación de rendimiento mantienen abierta la fase. Ver [registro actualizado](rendimiento-local.md).
