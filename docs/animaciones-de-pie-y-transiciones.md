# El Dirto — De pie y transiciones continuas

Muestra de revisión sobre el personaje, el balón y el entorno existentes. Se conservan la recuperación sentada, Dribble y Crossover aprobados. El archivo de referencia `el_dirto_v11.glb` no sustituye ningún elemento de la escena.

## Movimientos

| Movimiento        | Duración | Descripción                                                                                                                                                    |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Descanso          | 8 s      | Recuperación sentada aprobada, con respiración suave.                                                                                                          |
| Dribble           | 2,375 s  | Cinco botes con la derecha, sentado.                                                                                                                           |
| Crossover         | 3,167 s  | Cambios de mano sentado, por delante de los pies.                                                                                                              |
| De pie            | 4,417 s  | Dribble derecho, crossover a la izquierda, bote izquierdo, vuelta a la derecha, preparación de la postura, pase entre las piernas, bote izquierdo y regreso.   |
| Entrada del balón | 3,5 s    | El balón inicia unos botes por sí solo, pasa por delante de los pies y sube a la mano derecha. El personaje permanece sentado y prepara la postura de dribble. |
| Levantada         | 2,5 s    | Lleva el peso hacia delante, se incorpora con el balón y coloca los pies para jugar.                                                                           |

El juego de pie combina ocho botes. Durante los pases entre las piernas mantiene las piernas erguidas, con una flexión suave de unos 11,5° en las rodillas, y guía el balón por el espacio libre. El brazo libre queda extendido hacia abajo, cerca de la vertical, y se levanta solo para preparar la recepción. Los pies conservan una separación lateral de 58 cm. En cada recepción quedan escalonados 41 cm: balón en la derecha, pie izquierdo delante; balón en la izquierda, pie derecho delante. Los pies intercambian su profundidad suavemente durante el vuelo del balón, con un pequeño despegue; la pelvis acompaña el movimiento para mantener las piernas erguidas. El balón conserva su tamaño, material y costuras; se aplasta en el contacto con el suelo y acumula su giro sin reiniciarlo al cambiar de estado.

## Transiciones

- **Descanso → sentado con balón:** termina una breve acomodación de la respiración y el balón se acerca botando por sí solo.
- **Descanso → de pie:** acomodación, entrada del balón y levantada.
- **Dribble ↔ Crossover sentado:** completa el bote hasta una recepción común con la derecha.
- **Sentado con balón → de pie:** completa la recepción y se levanta.
- **De pie → sentado con balón:** llega a una recepción compatible y vuelve a la banca.
- **Cualquier juego → descanso:** vuelve a la banca cuando corresponde y el balón vuelve botando a su posición original.

La entrada del balón y la levantada se reproducen al revés para devolver el balón a su lugar y volver a sentarse. Los enlaces comparten postura, posición y escala del balón. La orientación de las costuras se conserva entre clips.

El cambio puede esperar al siguiente punto de recepción: no se interrumpe un bote en el aire. Si se elige otra animación durante una transición, termina el conector actual y sigue hacia la última opción elegida. Pausar conserva el movimiento exactamente donde está. El control de tiempo se desactiva durante los cambios para evitar saltos manuales.

## Cómo revisar

1. Abrir el visor servido por HTTP y seleccionar **De pie** desde Descanso.
2. Probar **Dribble**, **Crossover** y **Descanso** mientras está jugando de pie.
3. Cambiar de opción durante la levantada o la vuelta a la banca.
4. Pausar y reanudar durante una transición.
5. Probar los cinco puntos de vista y una ventana estrecha.

La cámara acompaña gradualmente la incorporación para mantener al personaje dentro del encuadre. Se conserva el entorno y su iluminación.

## Archivos

- `El_Dirto_Continuous.blend`: fuente editable con los seis movimientos del personaje y sus acciones `Ball_*` correspondientes. Para revisar en Blender, seleccionar la acción del personaje en `RIG_Controls_D05` y la acción del mismo nombre con prefijo `Ball_` en `Ball_Motion`. Fotograma inicial 1; el último repite el primero en los loops. 24 fps.
- `visor/`: muestra web compilada. Servir esta carpeta por HTTP; abrir `index.html` directamente como archivo no permite cargar los modelos.
- `muestras/`: nueve imágenes del movimiento sobre la escena original.
- `validacion/`: resultados de enlaces, recorridos, exportación y pruebas.

## Implementación y comprobaciones

Un único personaje con la misma topología reproduce todos los movimientos. Esto permite cambiar de clip sin sustituir mallas ni reiniciar su apariencia. Las poses se exportan desde el rig original; la representación compartida conserva los 67.406 triángulos y la paleta del modelo. El balón original sigue siendo un objeto independiente, sincronizado con el mismo reloj.

Las pruebas cubren los 16 pares de estados, las solicitudes sucesivas durante un conector y la continuidad del giro. Se verifican también los enlaces de las poses y los recorridos del balón contra pantalón y zapatos, incluyendo cuatro muestras por fotograma exportado.

Los renders son muestras del archivo nativo. El pase entre las piernas usa una trayectoria estilizada, adaptada a las proporciones del personaje.

La revisión interactiva en el navegador no pudo completarse porque su verificación de seguridad no estaba disponible. Se revisaron los renders y los datos de animación.
