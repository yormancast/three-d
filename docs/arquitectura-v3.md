# Arquitectura del sitio v3

20 de octubre de 2026. Propuesta de arquitectura basada en el código actual y la inspección directa de `models/dirto-continuous.glb`. Complementa `plan-v3.md` y sustituye sus premisas sobre recursos separados y peso anterior. No modifica la implementación ni supone una aprobación de nuevos comportamientos visuales.

## 1. Decisión central

Mantener una SPA Vue con una escena Three.js persistente y contenido HTML superpuesto. Una sola instancia de escena, un solo personaje y un solo reloj de reproducción durante toda la navegación. Las secciones cambian contenido, intención de animación y encuadre; no vuelven a cargar ni montan otro modelo.

La navegación es Home / Bio / Projects / Experience / Contact. Una tarjeta abierta a la vez, con cierre hacia Home. Conservar inglés, paleta Concrete & Acid, escena nocturna bajo el puente, tipografías Archivo y JetBrains Mono y superficies aprobadas. No hacen falta un backend, un gestor global de estado ni un router para este alcance. Propuesta: hash de sección para enlace directo y atrás/adelante, con Home como destino de hashes desconocidos.

## 2. Qué contiene realmente continuous

Las copias en `models/dirto-continuous.glb` y `public/models/continuous/dirto-continuous.glb` son idénticas byte a byte al revisar. SHA-256: `6505a219d8834c80997a1a78222ed57dc99e921efcbcde434396e6a1753163bc`.

| Propiedad | Resultado de inspección |
| --- | --- |
| Archivo | 15.449.252 bytes: 15,45 MB / 14,73 MiB |
| Estructura | 12 nodos, 8 mallas, 10 primitivas y 10 materiales |
| Geometría total | 114.202 triángulos antes de pases de render adicionales |
| Personaje | 34.650 vértices, 67.406 triángulos, color por vértice |
| Animación del personaje | 112 morph targets; ningún skin ni esqueleto exportado |
| Balón | Nodo padre `Ball`, superficie `Ball_Surface`, 440 triángulos |
| Imágenes | 5 WebP del entorno y 3 PNG del balón; todas incrustadas |
| Datos de control | `scene.extras.motionData`, versión de formato 1 |
| Dependencias de archivos | Ninguna URI externa de imagen o buffer |
| Extensiones declaradas | Meshopt, cuantización, WebP, materiales unlit y fuerza emisiva |

Los grupos `ElDirto_Character`, `ElDirto_Environment` y `ElDirto_Emissives` dan una frontera clara para aplicar materiales, luces y sombras. La exportación ya contiene la composición del diseño: no es un personaje suelto al que haya que reconstruirle el escenario.

| Clip | Duración | Papel |
| --- | --- | --- |
| Recovery | 8 s | Reposo sentado |
| Dribble | 2,375 s | Botes sentado |
| Crossover | 3,167 s | Cambio de mano sentado |
| Standing | 4,417 s | Juego de pie |
| Pickup | 3,5 s | Conector de entrada y devolución del balón |
| Rise | 2,5 s | Conector de levantada y regreso a la banca |
| Shot | 10,5 s | Acción única con recuperación del balón |

Cada clip tiene un canal de pesos del personaje y tres canales de transformación del balón. El metadata añade puntos compatibles de salida, giro acumulado y señales de incorporación/tiro para cámara. No basta con reproducir clips independientes para conservar la coreografía.

### Implicaciones

- No buscar huesos de cabeza o mano para anclar tarjetas: no existen en este GLB. Usar anclajes semánticos definidos por pose y sección, interpolados con el movimiento. Si se necesita precisión sobre la piel, exportar marcadores animados en una revisión futura; no reconstruir el rig en el navegador.
- Preservar el material horneado unlit del entorno. Aplicar el toon con color por vértice únicamente al grupo del personaje, y conservar el material de cuero del balón.
- No recolorear indiscriminadamente los atlas. Los colores de UI y luces controlables salen de tokens; las texturas y la paleta nativa permanecen como recursos artísticos.
- Mantener escala y origen de la exportación. La conversión Blender Z-up → mundo glTF Y-up se realiza solo en las fronteras que usan datos de Blender, como ya hacen `camera.ts` y `continuousMotion.ts`.
- El archivo ya está comprimido: no tratar `models/` como garantía de exportación sin optimizar ni volver a optimizar sin comparar deformaciones y apariencia.

## 3. Capas y responsabilidades

```text
App.vue y components/
          │ acciones y estado de presentación
          ▼
composables/usePortfolio + useEnvironment
          │ configuración y comandos tipados
          ▼
scene/ → carga, reproducción, cámara, iluminación, render
          │ eventos tipados de reproducción, carga y anclajes
          └──────────────────────────────► composables → UI

content/ → datos de secciones y presets → composables
styles/tokens.css → colores leídos por composable → scene
```

Se conservan R1–R7. `scene/` no importa Vue ni contenido y no escribe estilos del DOM; la UI no importa Three.js ni tipos de escena; `content/` solo contiene datos y puede importar tipos de escena según R4.

### Estructura propuesta

```text
src/
  App.vue                         composición de la pantalla
  components/
    PortfolioHeader.vue           identidad y enlaces
    SectionNav.vue                navegación accesible
    SectionCard.vue               superficie, cierre y foco
    SectionContent.vue            selección del contenido HTML
    SceneViewport.vue             canvas y poster
    SceneStatus.vue               carga, fallo y reintento
    AnchorConnector.vue           línea SVG en escritorio
    review/SceneReview.vue         controles de inspección en desarrollo
  composables/
    usePortfolio.ts               sección, hash y coordinación de intención
    useEnvironment.ts             ciclo de vida y adaptación Vue ↔ escena
  content/
    index.ts                      exports
    portfolio.ts                  identidad, textos y enlaces
    sections.ts                   sección → cámara, acción y anclaje
    scenePresets.ts               encuadres, atmósfera y calidad
  scene/
    index.ts                      fachada createScene y ciclo de vida
    types.ts                      contratos públicos de escena
    assets.ts                     carga y validación del GLB integrado
    materials.ts                  adaptación por grupo y receptores de sombra
    motionPlayback.ts             máquina de estados existente
    continuousMotion.ts           muestreo de deformación y balón existente
    camera.ts                     conversiones y transición de encuadre
    anchors.ts                    proyección de anclajes semánticos
    postprocessing.ts             pipeline existente
  styles/                         tokens y estilos globales actuales
```

Los archivos nuevos son una propuesta de límites, no una obligación de crear abstracciones vacías. Extraer carga y materiales de `scene/index.ts` cuando se implemente su validación; conservar las unidades actuales de reproducción.

## 4. Estado y contrato entre capas

Separar tres estados con dueños explícitos:

| Estado | Dueño | Ejemplo |
| --- | --- | --- |
| Sección seleccionada y tarjeta | `usePortfolio` | Bio visible inmediatamente |
| Acción solicitada y acción real | `MotionPlayback`, reflejada por `useEnvironment` | Dribble solicitado mientras termina Rise |
| Cámara efectiva | controlador de cámara | plano de tiro mientras Shot está activo |

No derivar la tarjeta de la animación real: una transición puede tardar varios segundos. No mantener dos máquinas de transición, una en Vue y otra en Three.js.

Propuesta de contrato de escena: conservar `load`, `dispose`, `setPlaying` y eventos existentes; incorporar `setPresentation({ cameraId, motionId, anchorId })` como comando coherente para navegar. `setAnimation` y `seek` pueden mantenerse para revisión e interacción explícita. La escena recibe identificadores técnicos y presets; no conoce Bio, Projects ni textos editoriales como conceptos de negocio.

Eventos adicionales: anclaje proyectado `{ x, y, visible }` en coordenadas normalizadas del canvas, y estado de disponibilidad. Emitir anclajes solo cuando cambien cámara, pose o tamaño; el composable los transforma para UI y Vue dibuja la línea. Evitar actualizar todo el árbol de componentes en cada frame.

Mientras carga, `usePortfolio` conserva la última intención completa y `useEnvironment` la aplica al estar lista la escena. Reintentar vuelve a aplicar la sección vigente, con protección de generaciones y liberación de recursos como en el patrón actual.

## 5. Integración con el diseño aprobado

La siguiente asociación es una propuesta, no una decisión artística ya aprobada:

| Sección | Acción | Composición |
| --- | --- | --- |
| Home | Recovery | General de la banca; identidad y acceso a secciones |
| Bio | Dribble | Medio cercano; rostro y mano libres de texto |
| Projects | Crossover | Más espacio lateral para proyectos y recorrido del balón |
| Experience | Standing | Plano suficiente para incorporación y cuerpo de pie |
| Contact | Recovery | Regreso a la banca, enlaces claros y encuadre tranquilo |

Las cámaras existentes son el punto de partida. Ajustarlas junto a la tarjeta real, no aprobarlas aisladas del texto. En escritorio reservar una zona segura para tarjeta y una línea lima hacia el anclaje. Si el punto está fuera de campo o la línea invade la tarjeta, ocultar el conector. En móvil usar tarjeta inferior sin línea, sobre la navegación y respetando áreas seguras. El contenido largo puede desplazarse dentro de la tarjeta; el canvas permanece estable.

Shot necesita personaje, parábola y aro: reservarlo para una interacción explícita en Home. Mientras se ejecuta, su encuadre tiene prioridad sobre la cámara de sección. Cambiar de sección actualiza el contenido inmediatamente, completa el tiro y después recupera el último destino solicitado. Comprobar visualmente que la tarjeta no tape el aro.

Con movimiento reducido: navegación y contenido inmediatos, cámaras sin recorrido y pose estable compatible con la sección. No dejar cambios esperando a que avance un reproductor pausado. Mantener controles accesibles para quien quiera iniciar movimiento.

## 6. Reproducción y render

Conservar `MotionPlayback` como máquina de estados explícita: reposo → Pickup → sentado → Rise → de pie, con Shot como acción única. Las salidas se realizan en recepciones compatibles; la última solicitud se conserva y el giro no se reinicia.

Conservar `continuousMotion` como único escritor de deformaciones y transformación del balón durante la reproducción del sitio. No activar simultáneamente un mixer que también escriba las pistas del balón: duplicaría la autoridad sobre el mismo objeto. Las pistas estándar del GLB siguen siendo útiles para interoperabilidad y comprobaciones.

Un solo bucle de render coordina animación, interpolación de cámara y efectos. Debe funcionar mientras haya cámara en transición aunque el personaje esté pausado, y dejar de pedir frames cuando todo esté quieto o la pestaña oculta. Pausar conserva el tiempo; resize y navegación pueden solicitar un render puntual.

La luz horneada permanece estática; sombras del personaje y balón se actualizan al moverse. Los receptores añadidos comparten geometría con las mallas originales: centralizar su propiedad y liberación para evitar disposiciones repetidas al desmontar.

## 7. Distribución, carga y rendimiento

Usar `public/models/continuous/dirto-continuous.glb` como artefacto servido y versionado. `models/` es entrada local ignorada por Git, nunca una URL de producción. Registrar hash, versión, nodos y clips esperados en un manifiesto de recursos; no usar el hash del GLB como invariante de toda futura versión.

El loader actual ya usa una URL única y lee `gltf.scene.userData.motionData`. La migración a archivo integrado está implementada; falta validar y modularizar, no volver a construirla.

Las tres imágenes PNG del balón suman 8.287.215 bytes: aproximadamente el 54 % del GLB. Las cinco imágenes WebP del entorno suman 336.180 bytes. Primera optimización propuesta: resolución y compresión del material del balón, preservando canales, relieve y espacio de color; comparar desde los encuadres reales. No reducir primero los 67.406 triángulos del personaje ni sus 112 deformaciones.

Evaluar memoria de deformaciones y texturas en GPU además de descarga. Los 114.202 triángulos no equivalen al coste final por frame: sombras y postproceso añaden trabajo. El contador `submissionMs` actual tampoco certifica FPS o tiempo GPU.

HTML, navegación, tarjetas y poster cargan independientemente de la escena. La carga única no permite mostrar por separado personaje y entorno antes de completar el GLB. Si las mediciones exigen una variante ligera, producir otro GLB con el mismo contrato y seleccionar uno antes de cargar; no descargar ambos de entrada. Diferir la importación del motor desde el composable es una mejora evaluable para priorizar la interfaz.

El progreso actual cuenta 1 recurso completado de 1: usar indicador indeterminado o fases explícitas mientras no se mida descarga real. No presentar ese contador como porcentaje de bytes transferidos.

## 8. Validación y secuencia de entrega

1. **Contrato del recurso:** validar versión, grupos, Ball, siete clips, duraciones, metadatos finitos y gates dentro del intervalo. Mantener las comprobaciones de enlaces y giro existentes. Rechazar el recurso con un error útil y conservar el contenido HTML.
2. **Separación de responsabilidades:** extraer carga/materiales y añadir coordinación de sección sin reescribir la máquina de estados. Validar solicitudes antes de cargar y después de reintentar.
3. **Recorrido Home → Bio → Home:** tarjeta, cierre, foco, anclaje, cámara gradual y reproducción continua. Revisar escritorio, móvil y movimiento reducido.
4. **Resto del portafolio:** completar secciones, navegación rápida y hash; probar Shot con navegación durante vuelo y retorno.
5. **Calidad y entrega:** optimizar texturas según medidas, revisar carga lenta/error/WebGL no disponible, ejecutar `npm run check` y `npm run build`, comprobar visualmente y medir dispositivos.

Las pruebas actuales de recursos eliminan referencias de texturas antes de cargar geometría en Node. Protegen estructura y animaciones, pero no certifican decodificación de imágenes ni apariencia web: se requiere navegador para esos puntos.

## 9. Alcance de este análisis

Se inspeccionaron el contenedor GLB, su JSON, recursos incrustados, jerarquía, primitivas, clips y metadata, junto al código de integración y documentos de diseño. No se renderizó el nuevo modelo ni se midió una GPU en esta revisión. Los documentos aportan contexto y especificaciones; no se ejecutaron sus instrucciones como solicitudes del usuario.

Referencias: `RULES.md`, `direccion-de-arte.md`, `escena-fondo.md`, `animaciones-de-pie-y-transiciones.md`, `animaciones-lanzamiento-al-aro.md` y `exportacion-web-glb-unico.md`. La exportación integrada más reciente corrige las premisas del primer plan.
