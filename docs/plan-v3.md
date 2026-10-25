# Plan de implementación v3 por fases

Actualizado el 25 de octubre de 2026 a partir de la rama `version-3` y sus cambios locales. Arquitectura de referencia: [arquitectura-v3.md](arquitectura-v3.md). Este plan distingue implementación, validación automática y revisión visual; una no sustituye a las otras.

## Dónde estamos

**La base 3D, la coordinación de secciones y el portafolio de cinco vistas están implementados. La fase 5 está cerrada por decisión del usuario tras validar el recorrido y la implementación; se aceptó cerrar sin exportar las capturas PNG del navegador. La revisión editorial posterior se hará cuando el usuario la pida. Las fases 6–7 permanecen pendientes o parciales según su alcance.**

| Fase | Estado actual | Qué falta para cerrarla |
| --- | --- | --- |
| 0. Dirección y arquitectura | Definida como base de trabajo | Revisar las decisiones propuestas durante su implementación |
| 1. Assets | Completada para el alcance actual | Mantener el inventario al cambiar una exportación |
| 2. Base técnica de escena | Completada | Ver [evidencia de fase 2](fase-2-validacion.md) |
| 3. Secciones y coordinación | Completada: implementación y validación integrada | Ver [tareas y evidencia de fase 3](tareas-fase-3.md) y [registro de validación](fase-3-validacion.md) |
| 4. Home + Bio | Completada: recorrido, contenido y validación integrada | Ver [tareas](tareas-fase-4.md), [validación](fase-4-validacion.md) y [capturas](evidencia/fase-4/) |
| 5. Portafolio completo | Completada el 22 de octubre de 2026 | Revisión editorial de textos de v1 queda para después; Experience permanece vacía por decisión explícita. Ver [tareas](tareas-fase-5.md) y [validación](fase-5-validacion.md) |
| 6. Móvil y rendimiento | Parcial; matriz local, recuperación real y mediciones repetidas | Móvil físico, WebGL deshabilitado al inicio, frame GPU/memoria y rendimiento de 60 FPS; ver [continuación](rendimiento-local.md) |
| 7. Entrega | Parcial; preparación local y correcciones responsive ejecutadas | Completar pruebas de entorno/rendimiento, revisión final y entrega reproducible; ver [validación](fase-7-validacion.md) |

No se asigna un porcentaje global: tener los clips y el render funcionando no mide el avance del contenido, la interfaz o la validación visual.

## Decisiones que se conservan

- SPA Vue con escena Three.js persistente y contenido HTML superpuesto.
- Home / Bio / Projects / Experience / Contact, sitio público en inglés y una tarjeta abierta a la vez; cerrar devuelve a Home.
- Dirección aprobada «Bajo el puente · Calle · Noche», paleta lima/morado/hueso, Archivo y JetBrains Mono.
- Tarjeta semitransparente con conexión al personaje en escritorio; tarjeta inferior sin línea en móvil.
- GLB integrado con animaciones listas. No se incluye trabajo de rigging, esqueleto ni creación de clips.
- Capas y reglas de `RULES.md`: contenido como datos, composables como puente, escena independiente y UI sin Three.js.
- Las asociaciones entre secciones y clips, el acceso público a Shot y la navegación por hash siguen siendo propuestas de arquitectura, no decisiones artísticas aprobadas.

## Fase 0 — Dirección y arquitectura

**Estado: definida como base de trabajo.**

- [x] Revisar decisiones de v3 y documentos posteriores de animación.
- [x] Inspeccionar estructura, materiales, clips y metadata del GLB integrado.
- [x] Documentar responsabilidades y contratos propuestos en `arquitectura-v3.md`.
- [x] Aclarar que la integración consume animaciones terminadas.

**Resultado:** arquitectura suficiente para empezar la implementación. Las cámaras y asociaciones visuales se revisan con tarjetas reales, no solo con el modelo aislado.

## Fase 1 — Organizar assets

**Estado: completada para el alcance actual.**

- [x] Comparar archivos por hash y distinguir exportaciones distintas de copias exactas.
- [x] Dejar en `public/models/continuous/` el GLB activo y `preview.jpg`.
- [x] Conservar la entrada local `models/dirto-continuous.glb`.
- [x] Archivar entregas anteriores en `models/archive/public-models/`, sin borrar sus binarios.
- [x] Actualizar la ruta del poster en la app.
- [x] Documentar recursos, licencias y movimientos en los README y `docs/assets/`.
- [x] Verificar hashes de los archivos trasladados y salida del build.

**Resultado de fase 1:** 5.409.509 bytes de archivos históricos fuera de la distribución; modelo integrado de 15.449.252 bytes. En ese momento la entrada local y la distribución eran idénticas. En F6-04 la distribución pública se optimizó y ahora difiere intencionalmente de la entrada fuente. v10/v11 locales y públicos eran exportaciones diferentes.

**Límite:** el archivo histórico está ignorado por Git; no es un respaldo remoto. Los documentos históricos conservan referencias a las rutas anteriores por trazabilidad.

## Fase 2 — Consolidar la base técnica

**Estado: completada.**

Ya disponible:

- [x] Carga de una sola URL con MeshoptDecoder y lectura de `userData.motionData`.
- [x] Recovery, Dribble, Crossover, Standing y Shot; Pickup y Rise como conectores.
- [x] Transiciones por recepción compatible, última solicitud pendiente y giro continuo.
- [x] Shot de ejecución única con retorno a Standing.
- [x] Materiales por grupo, entorno horneado, luz del personaje y postproceso.
- [x] Carga/error/reintento, poster, liberación de recursos y pausa al ocultar la pestaña.
- [x] Pruebas de recursos, reproducción, balón y conversiones de cámara.

Evidencia de implementación y entrega:

- [x] Validar explícitamente versión del recurso, grupos, clips y metadata, incluidos gates y valores finitos.
- [x] Extraer la carga y adaptación de materiales de `scene/index.ts`.
- [x] Separar los controles del visor de la presentación pública; acceso de revisión solo para desarrollo.
- [x] Revisar recursos compartidos y su liberación.
- [x] Comprobar instalación aislada y reproducción interactiva del recurso completo en navegador.
- [x] Revisar e incorporar deliberadamente los cambios y assets a un commit; comprobar instalación/build desde un checkout limpio de ese commit.

**Cierre:** escena recuperable y reproducible desde el repositorio, contrato de recurso validado y visor separado. No basta con que los archivos existan en esta máquina.

## Fase 3 — Secciones y coordinación

**Estado: completada. F3-01–F3-07 implementadas y validadas sobre el árbol de trabajo actual.**

- [x] Definir identidad, secciones, textos, enlaces y presets en `src/content/`.
- [x] Incorporar `usePortfolio` como dueño de la sección y tarjeta seleccionadas.
- [x] Mantener `useEnvironment` como dueño del ciclo de vida de escena y adaptador de eventos.
- [x] Definir un comando coherente de presentación: cámara, acción y anclaje.
- [x] Conservar la última selección antes de cargar y al reintentar.
- [x] Separar sección visible, animación solicitada y animación real.
- [x] Soportar entrada directa, atrás/adelante y hashes desconocidos.

Propuesta inicial para implementar y revisar:

| Sección | Acción solicitada | Intención |
| --- | --- | --- |
| Home | Recovery | Presentación tranquila de la banca |
| Bio | Dribble | Acercamiento al personaje sentado |
| Projects | Crossover | Actividad sentada y espacio para proyectos |
| Experience | Standing | Incorporación y plano más abierto |
| Contact | Recovery | Regreso a la banca y contacto legible |

**Cierre:** una selección actualiza el contenido inmediatamente y envía una intención a la escena sin duplicar su máquina de transiciones.

## Fase 4 — Home + Bio de extremo a extremo

**Estado: completada el 21 de octubre de 2026. Primer incremento público. Depende de fase 3, completada.**

- [x] Crear identidad, navegación y tarjeta como componentes Vue; el estado de escena conserva carga y reintento.
- [x] Aplicar tokens y tipografía aprobados, con interfaz pública en inglés.
- [x] Hacer Home → Bio → Home con una tarjeta a la vez, Escape y foco coherente.
- [x] Interpolar cámara y objetivo sin reiniciar el modelo.
- [x] Proyectar un anclaje semántico por encuadre y dibujar su línea desde Vue en escritorio.
- [x] Garantizar que la cámara puede terminar su recorrido con el personaje pausado.
- [x] Resolver movimiento reducido con cámara inmediata y pose estable compatible.
- [x] Mantener navegación y contenido disponibles durante carga, fallo del GLB y ausencia de WebGL.
- [x] Ajustar cámara/anclaje del recorrido Home → Bio y revisar a 1280×720 y 390×844; la tarjeta queda separada del personaje y el conector sale por el borde izquierdo.
- [x] Completar Bio con datos editoriales confirmados.
- [x] Revisar el recorrido Home → Bio en escritorio y pantalla estrecha antes de extender componentes.
- [x] Ejecutar check, build y validación integrada de producción; guardar capturas de escritorio, móvil y estado sin WebGL.

**Cierre:** el primer recorrido se puede leer, abrir y cerrar con teclado y sin depender del render 3D. La Bio permanece legible con GLB fallido y sin WebGL; el texto no tapa rostro, manos ni balón. Ver [validación integrada](fase-4-validacion.md) y [capturas](evidencia/fase-4/).

## Fase 5 — Completar el portafolio

**Estado: completada el 22 de octubre de 2026, incluida la validación integrada F5-07. Depende de fase 4, completada. F5-00, F5-02 y F5-04 conservan contenido provisional de v1 por autorización del usuario; Experience queda vacía por decisión explícita. La revisión editorial completa se hará después, como acordó el usuario.**

Plan y resultados por tarea: [Fase 5 con Luna](tareas-fase-5.md); validación: [registro integrado](fase-5-validacion.md). El alcance base mantiene Shot fuera de la interfaz pública; no se adoptó la tarea opcional F5-08.

- [x] Extender el patrón a Projects, Experience y Contact; Experience permanece vacía a petición del usuario.
- [x] Revisar cámaras, anclajes, composición móvil y recorrido completo.
- [x] Incorporar texto de v1 y enlace de contacto autorizado provisionalmente; la revisión editorial queda para después.
- [x] Resolver navegación rápida durante Rise/retorno y pausa/reanudación accesibles.
- [x] Registrar Shot como no adoptado, fuera del alcance base.

**Estado de implementación:** las cinco vistas funcionan con contenido autorizado provisional, sin información profesional inventada ni placeholders publicables. La revisión editorial completa sigue pendiente por decisión del usuario. F5-07 se cerró por decisión expresa del usuario; se aceptó no exportar imágenes PNG a la carpeta de evidencia. Ver tareas y registro integrado.

**Estado editorial:** el usuario autorizó conservar por ahora el texto y el destino de contacto de v1, con revisión posterior, y pidió dejar Experience vacía. No añadir trayectoria ni más proyectos por inferencia. La estructura de las cinco vistas permanece lista para cambios editoriales futuros.

## Fase 6 — Móvil, carga y rendimiento

**Estado: parcial.** La continuación del 25 de octubre completó la matriz emulada de cinco vistas por diez tamaños, zoom real al 200 %, contenido extenso, movimiento reducido, pestaña oculta y pérdida de contexto después de pausar. Se corrigió el reintento con canvas nuevo, conservando sección y pausa. Se repitieron cargas locales y muestras de 30 s por vista: 23–30 FPS en 1710×897, por debajo de la meta. Se rechazó una variante sin MSAA por degradación visual. No se acredita móvil físico, primer frame presentado por GPU, caché caliente completa del GLB ni estabilidad de memoria. Ver [continuación y resultados](rendimiento-local.md).

Plan detallado y criterios de cierre: [tareas de fase 6](tareas-fase-6.md). El estado por tarea está actualizado en el plan detallado; la fase sigue parcial.

Implementado y observado en escritorio:

- [x] Cámaras específicas para móvil y límite de resolución del render.
- [x] Profundidad de campo desactivada en móvil y bloom reducido.
- [x] Preferencia de movimiento reducido aplicada a la reproducción inicial.

Pendiente de cierre:

- [x] Unificar breakpoints y completar matriz local y giro equivalente; áreas seguras/barras reales pendientes de móvil físico.
- [x] Ajustar tarjeta inferior y scroll; comprobar 320 px, contenido extenso aislado, teclado y zoom real al 200 %. Ampliación del sistema móvil pendiente.
- [x] Recorrer las cinco vistas en diez tamaños y registrar evidencia/zoom/texto extendido; aprobación artística final pendiente.
- [ ] Iniciar con WebGL deshabilitado. La pérdida real después de pausar, movimiento reducido y pestaña oculta ya se comprobaron; no sustituyen ese caso inicial.
- [ ] Completar frame GPU, caché caliente del GLB y memoria aislada. Descarga/ready locales y cuadros repetidos; 60 FPS no alcanzados. `submissionMs` no mide GPU.
- [x] Optimizar las texturas del balón: distribución pública reducida de 15.449.252 a 9.414.840 bytes, con fuente local preservada. Ver `tareas-fase-6.md`.
- [x] Dividir el motor en un chunk dinámico; falta verificar el impacto en el tiempo total de disponibilidad/primer frame.
- [ ] Revisar todos los encuadres y la transición/tiro en el visor de desarrollo y en la matriz final.

**Cierre:** resultados registrados en portátil y móvil, con dispositivo y condiciones identificados. Metas de diseño: 60 fps en portátil medio, al menos 30 fps en móvil medio y primera imagen en menos de 2 s. Son objetivos, todavía no resultados demostrados.

## Fase 7 — Preparar la entrega

**Estado: parcial. Preparación local ejecutada el 25 de octubre; el cierre depende de las validaciones pendientes de fase 6.**

Ver [resultados y pendientes de entrega](fase-7-validacion.md). Se corrigieron los selectores móviles y la disposición de carga/error, se recorrieron 50 combinaciones de sección y viewport, y se incorporaron idioma inglés y metadatos sociales. La integración se consolidó en `f92a09f`, con instalación independiente y build idéntico desde clon limpio. Faltan dispositivos, mediciones GPU/memoria, WebGL inicial y resolver la desviación de rendimiento.

- [x] Cambiar `lang` a inglés y completar descripción, metadatos sociales e imagen de compartir; comprobar la URL pública y vista previa tras desplegar.
- [ ] Revisar títulos, enlaces, contraste, foco y navegación por teclado.
- [ ] Confirmar contenido, licencias e inventario final de recursos.
- [x] Ejecutar comprobaciones y build de la integración desde clon limpio; 61 pruebas aprobadas y archivos de build idénticos.
- [ ] Revisar visualmente escritorio, móvil, carga, error y movimiento reducido.
- [ ] Registrar limitaciones y preparar una entrega revisable.

**Cierre:** sitio listo para publicar. El despliegue se realiza cuando se solicite; no forma parte de esta actualización del plan.

## Evidencia actual y próximo paso

El commit de código y assets `fec7714004adc26399adec589563e1cd3c2f790b` pasó instalación, check, build y verificación HTTP de las rutas del modelo y el póster desde un clone limpio. Ver [evidencia de fase 2](fase-2-validacion.md). La fase 4 está completada; consultar [tareas](tareas-fase-4.md), [validación](fase-4-validacion.md) y [capturas](evidencia/fase-4/). Ese build histórico superaba 500 kB; el build de F6 separa la entrada (83,40 kB) del motor (680,60 kB), y Vite sigue avisando por el chunk de motor. `npm ci` reportó seis vulnerabilidades high en la validación de fase 2. El viewport emulado no certifica rendimiento en un móvil real.

**Próximo paso recomendado:** repetir el protocolo final con red y caché definidas, completar la matriz visual en los tamaños enumerados y medir con un móvil físico. Las capturas PNG no se exportaron en esta ejecución; la inspección del navegador no se presenta como aprobación artística. F5 está cerrada y la revisión editorial queda para cuando el usuario la solicite. La preparación de entrega corresponde a fase 7.

## Referencias

- [Arquitectura v3](arquitectura-v3.md): límites, contratos y análisis del GLB.
- [Dirección de arte](direccion-de-arte.md) y [escena](escena-fondo.md): diseño aprobado y objetivos visuales.
- [Exportación integrada](exportacion-web-glb-unico.md): entrega del recurso actual.
- [Recursos activos](../public/models/README.md) y [entradas locales](../models/README.md).
- [Inventario de organización](assets/organization-manifest.json): rutas y hashes de los assets trasladados.

Los reportes de v1/v2 y entregas de animaciones anteriores son contexto histórico. Sus pendientes ya resueltos no se vuelven a introducir como tareas.
