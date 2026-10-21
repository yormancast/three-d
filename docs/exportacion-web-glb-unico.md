# El Dirto — archivo web integrado

Se actualiza el mismo archivo `public/models/continuous/dirto-continuous.glb`.
El único cambio visual es la superficie del balón: cuero naranja con grano, relieve y rugosidad, usando las texturas de baloncesto de DigitalN8m4r3. Las líneas de los paneles están incluidas en las texturas; se eliminaron las tres costuras geométricas anteriores. Conserva el tamaño, la esfera original y los movimientos.

El GLB contiene el personaje original, el balón, el entorno, los elementos emisivos, ocho imágenes incrustadas y los siete clips aprobados. No necesita imágenes ni archivos de movimiento externos.

| Clip      | Duración | Uso                                                     |
| --------- | -------- | ------------------------------------------------------- |
| Recovery  | 8 s      | Descanso sentado                                        |
| Dribble   | 2,375 s  | Dribble sentado                                         |
| Crossover | 3,167 s  | Crossover sentado                                       |
| Standing  | 4,417 s  | Combinación de pie, incluidos cambios entre las piernas |
| Rise      | 2,5 s    | Levantarse y sentarse en sentido inverso                |
| Pickup    | 3,5 s    | El balón llega botando; regreso en sentido inverso      |
| Shot      | 10,5 s   | Lanzamiento y recuperación                              |

## Uso en la web

El visor conserva los controles, las cámaras y las transiciones aprobadas. Carga una sola URL: `models/continuous/dirto-continuous.glb`.

La compresión del GLB requiere configurar `MeshoptDecoder` en `GLTFLoader`, como ya hace el visor. Sus grupos principales son `ElDirto_Character`, `ElDirto_Environment` y `ElDirto_Emissives`. El nodo animado del balón se llama `Ball`.

Cada clip incluye la animación del personaje y pistas estándar de posición, rotación y escala del balón. La aplicación conserva `continuousMotion.ts` y `motionPlayback.ts` para enlazar estados, mantener el giro acumulado del balón y controlar el encuadre durante el lanzamiento. Los datos de ese controlador están incrustados en `gltf.scene.userData.motionData`. Un visor genérico reproduce los clips, pero no decide automáticamente las rutas entre estados ni reproduce los efectos de cámara e iluminación propios de la aplicación.

## Archivos de prueba

- `visor/`: aplicación compilada; el GLB está en `visor/models/continuous/dirto-continuous.glb`.
- `El_Dirto_Continuous.blend`: fuente editable con las nuevas texturas empaquetadas.
- `muestras/`: comparación del balón y vista de la escena, renderizadas en Blender.
- `validacion/`: comparación de la exportación, pruebas y compilación.

El visor activo está en http://127.0.0.1:8898/. Para abrir la copia independiente, servir `visor/` por HTTP.

## Validación

Se compararon las transformaciones de los nueve nodos originales, 257 atributos y pistas, los 112 objetivos de deformación del personaje y todas las muestras de movimiento del balón. El balón conserva los 440 triángulos de su esfera original; se eliminaron los 1.536 triángulos de las costuras. Las imágenes originales del resto de la escena se conservan. La recompresión puede rotar cíclicamente los índices de un triángulo, conservando sus vértices y orientación.

Las 12 pruebas de la aplicación, el formato, el análisis de código, los tipos y la compilación pasaron. La inspección visual se realizó con renders nativos de Blender; no se pudo completar la revisión interactiva del navegador por una restricción de la herramienta de control.

## Material del balón

Se usa la variante `classic` del material **Basketballs**, creado por DigitalN8m4r3 (Miodrag Sejic), publicado bajo CC0 en https://opengameart.org/content/basketballs. Es un material artístico de baloncesto creado en Substance Painter, no una captura fotogramétrica. Incluye color, normal y oclusión/rugosidad/metallic. Se reproyectó al mapa esférico del balón existente; el modelo descargado se utilizó únicamente como referencia de UV y no sustituye al balón de la escena.

La copia original del material y su licencia están en `material-balon/`. Las líneas se ven como canales de los paneles mediante color y relieve del material, sin tubos ni piezas geométricas adicionales.
