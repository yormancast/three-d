# Plan de implementación v3 por fases

Actualizado el 20 de octubre de 2026 a partir de la rama `version-3` y sus cambios locales. Arquitectura de referencia: [arquitectura-v3.md](arquitectura-v3.md). Este plan distingue implementación, validación automática y revisión visual; una no sustituye a las otras.

## Dónde estamos

**Tenemos la base 3D y los assets organizados. La aplicación todavía es un visor de revisión, no el portafolio público. El próximo trabajo es conectar la navegación del sitio con la escena y construir Home + Bio completos.**

| Fase | Estado actual | Qué falta para cerrarla |
| --- | --- | --- |
| 0. Dirección y arquitectura | Definida como base de trabajo | Revisar las decisiones propuestas durante su implementación |
| 1. Assets | Completada para el alcance actual | Mantener el inventario al cambiar una exportación |
| 2. Base técnica de escena | Parcial, implementación principal disponible | Validar contrato del GLB, separar visor y comprobar instalación limpia |
| 3. Secciones y coordinación | Pendiente | Datos tipados y coordinación de sección, cámara y acción |
| 4. Home + Bio | Pendiente | Interfaz pública y primer recorrido completo |
| 5. Portafolio completo | Pendiente | Projects, Experience, Contact y contenido final |
| 6. Móvil y rendimiento | Parcial, ajustes del visor disponibles | Validar la interfaz final y medir dispositivos |
| 7. Entrega | Pendiente | Revisión integral y preparación para publicación |

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

**Resultado:** 5.409.509 bytes de archivos históricos fuera de la distribución; modelo integrado de 15.449.252 bytes. La entrada local y la distribución son idénticas al revisar. v10/v11 locales y públicos eran exportaciones diferentes.

**Límite:** el archivo histórico está ignorado por Git; no es un respaldo remoto. Los documentos históricos conservan referencias a las rutas anteriores por trazabilidad.

## Fase 2 — Consolidar la base técnica

**Estado: parcial.**

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
- [ ] Revisar e incorporar deliberadamente los cambios y assets a un commit; comprobar instalación/build desde un checkout limpio de ese commit.

**Cierre:** escena recuperable y reproducible desde el repositorio, contrato de recurso validado y visor separado. No basta con que los archivos existan en esta máquina.

## Fase 3 — Secciones y coordinación

**Estado: pendiente. Depende de la base de fase 2.**

- [ ] Definir identidad, secciones, textos, enlaces y presets en `src/content/`.
- [ ] Incorporar `usePortfolio` como dueño de la sección y tarjeta seleccionadas.
- [ ] Mantener `useEnvironment` como dueño del ciclo de vida de escena y adaptador de eventos.
- [ ] Definir un comando coherente de presentación: cámara, acción y anclaje.
- [ ] Conservar la última selección antes de cargar y al reintentar.
- [ ] Separar sección visible, animación solicitada y animación real.
- [ ] Si se adopta hash, soportar entrada directa, atrás/adelante y valores desconocidos.

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

**Estado: pendiente. Primer incremento público. Depende de fase 3.**

- [ ] Crear identidad, navegación, tarjeta, cierre y estados de carga como componentes Vue.
- [ ] Aplicar tokens y tipografía aprobados, con interfaz pública en inglés.
- [ ] Hacer Home → Bio → Home con una tarjeta a la vez, Escape y foco coherente.
- [ ] Interpolar cámara y objetivo sin reiniciar el modelo.
- [ ] Proyectar un anclaje semántico por encuadre y dibujar su línea desde Vue en escritorio.
- [ ] Garantizar que la cámara puede terminar su recorrido con el personaje pausado.
- [ ] Resolver movimiento reducido sin dejar navegación esperando una transición detenida.
- [ ] Mantener navegación y contenido disponibles durante carga o fallo de WebGL.
- [ ] Revisar el recorrido en escritorio y pantalla estrecha antes de extender componentes.

**Cierre:** el primer recorrido se puede leer, abrir y cerrar con teclado y sin depender del render 3D. El texto no tapa rostro, manos ni balón.

## Fase 5 — Completar el portafolio

**Estado: pendiente. Depende de fase 4.**

- [ ] Extender el patrón a Projects, Experience y Contact.
- [ ] Ajustar cámaras y anclajes junto al contenido real de cada sección.
- [ ] Incorporar proyectos con aportes y enlaces, experiencia con fechas y contacto confirmado.
- [ ] Resolver navegación rápida y cambios mientras el personaje se levanta o vuelve a la banca.
- [ ] Si se adopta Shot como interacción pública, mantener cámara de tiro hasta recuperar el balón y después atender la última sección solicitada.
- [ ] Mantener pausa/reanudación accesibles sin exponer controles técnicos de inspección.

**Cierre:** las cinco vistas funcionan con contenido final, sin información profesional inventada ni placeholders publicables.

**Información editorial necesaria:** cargo y presentación definitivos, proyectos, trayectoria y vías de contacto. Puede avanzarse con la estructura mientras se completan esos datos.

## Fase 6 — Móvil, carga y rendimiento

**Estado: parcial en el visor; pendiente para el sitio final. Se trabaja desde fase 4 y se cierra después de fase 5.**

Ya disponible:

- [x] Cámaras específicas para móvil y límite de resolución del render.
- [x] Profundidad de campo desactivada en móvil y bloom reducido.
- [x] Preferencia de movimiento reducido aplicada a la reproducción inicial.

Pendiente:

- [ ] Unificar breakpoints de escena y UI, respetar áreas seguras y orientación.
- [ ] Ajustar tarjeta inferior y desplazamiento interno con texto largo o ampliado.
- [ ] Validar descarga lenta, fallo, reintento y ausencia de WebGL con contenido utilizable.
- [ ] Sustituir el contador de un recurso por indicador indeterminado o progreso real.
- [ ] Medir descarga, memoria y FPS; `submissionMs` no es una medición de GPU.
- [ ] Evaluar compresión/resolución de las tres texturas del balón, que ocupan 8.287.215 bytes, antes de reducir geometría.
- [ ] Evaluar carga diferida del motor o variante ligera solo si las mediciones lo justifican.
- [ ] Revisar visualmente los cinco encuadres, las transiciones y el tiro en navegador.

**Cierre:** resultados registrados en portátil y móvil, con dispositivo y condiciones identificados. Metas de diseño: 60 fps en portátil medio, al menos 30 fps en móvil medio y primera imagen en menos de 2 s. Son objetivos, todavía no resultados demostrados.

## Fase 7 — Preparar la entrega

**Estado: pendiente. Depende del cierre de fases anteriores.**

- [ ] Cambiar `lang` a inglés y completar descripción, metadatos sociales e imagen de compartir.
- [ ] Revisar títulos, enlaces, contraste, foco y navegación por teclado.
- [ ] Confirmar contenido, licencias e inventario final de recursos.
- [ ] Ejecutar comprobaciones y build sobre la entrega final.
- [ ] Revisar visualmente escritorio, móvil, carga, error y movimiento reducido.
- [ ] Registrar limitaciones y preparar una entrega revisable.

**Cierre:** sitio listo para publicar. El despliegue se realiza cuando se solicite; no forma parte de esta actualización del plan.

## Evidencia actual y próximo paso

Última validación, tras organizar los assets: `npm run check` aprobado, 12 pruebas en 4 archivos y `npm run build` aprobado. Persiste el aviso de tamaño del paquete JavaScript. Las pruebas de geometría en Node no verifican decodificación de texturas ni apariencia en navegador.

Los cambios siguen en el árbol de trabajo, con archivos nuevos sin seguimiento. No se certifica todavía una instalación limpia ni una revisión visual del nuevo sitio.

**Próximo paso recomendado:** cerrar la fase 2 y después implementar las fases 3–4 como primer recorrido Home + Bio. No se requiere trabajo adicional de esqueleto o animación para comenzar.

## Referencias

- [Arquitectura v3](arquitectura-v3.md): límites, contratos y análisis del GLB.
- [Dirección de arte](direccion-de-arte.md) y [escena](escena-fondo.md): diseño aprobado y objetivos visuales.
- [Exportación integrada](exportacion-web-glb-unico.md): entrega del recurso actual.
- [Recursos activos](../public/models/README.md) y [entradas locales](../models/README.md).
- [Inventario de organización](assets/organization-manifest.json): rutas y hashes de los assets trasladados.

Los reportes de v1/v2 y entregas de animaciones anteriores son contexto histórico. Sus pendientes ya resueltos no se vuelven a introducir como tareas.
