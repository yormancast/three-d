# El Dirto — Lanzamiento al aro

Muestra sobre el personaje, el balón y el entorno existentes. Incluye los movimientos sentados y la combinación de pie aprobados, con una nueva acción **Lanzamiento**.

## Secuencia del tiro

El lanzamiento dura **10,5 segundos** y se ejecuta una sola vez al seleccionarlo.

| Tiempo    | Acción                                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| 0–1,8 s   | Se separa de la banca y gira hacia el aro con seis pasos cortos.                                           |
| 1,8–2,6 s | Reúne el balón, coloca la mano derecha debajo y lo estabiliza con la izquierda.                            |
| 2,6–3 s   | Eleva el balón y extiende el brazo derecho para lanzar. La izquierda deja de guiar.                        |
| 3–4,5 s   | El balón describe una parábola hacia el aro. El personaje acompaña el tiro y sigue el balón con la mirada. |
| 4,5–5,1 s | El balón entra por el centro del aro, desciende por la red y cae a la cancha.                              |
| 5,1–10 s  | Vuelve por sí solo dando botes y rodeando la banca. El personaje gira de regreso y prepara la recepción.   |
| 10–10,5 s | Completa un bote derecho y enlaza con el dribble de pie.                                                   |

El tiro usa el aro real de la escena, cuyo centro está en (−5,80; 9,16; 3,05) en coordenadas de Blender. La parábola alcanza unos 5,05 m. El regreso del balón es estilizado y autopropulsado, como su entrada desde el suelo en las animaciones anteriores.

La cámara se abre gradualmente para mostrar al personaje, el vuelo y el aro. Al regresar el balón recupera el punto de vista que estaba seleccionado. El movimiento de cámara también se conserva al pausar y recorrer el tiempo.

## Transiciones

- Desde **Descanso**, el balón se acerca botando; el personaje se levanta y prepara el tiro.
- Desde **Dribble** o **Crossover** sentado, termina la recepción común y se levanta antes de lanzar.
- Desde **De pie**, espera una recepción compatible e inicia el lanzamiento.
- Al terminar, vuelve automáticamente a **De pie**.
- Si se elige otro movimiento durante el tiro, completa el lanzamiento y la recuperación del balón, y después sigue hacia la última opción elegida.

Las poses de entrada y salida coinciden con la recepción derecha del juego de pie. El giro del balón se conserva entre acciones. No se reinicia la animación cuando se solicita un cambio en mitad del vuelo.

## Cómo probar

1. Abrir el visor y pulsar **Lanzamiento** desde cualquiera de los cuatro estados anteriores.
2. Observar los pasos, el apoyo de las manos, el vuelo y la canasta.
3. Comprobar que el balón rodea la banca y vuelve a la derecha.
4. Dejar terminar: debe continuar con **De pie** sin repetir el tiro.
5. Repetir el lanzamiento y seleccionar **Descanso** mientras el balón está en el aire: debe terminar el tiro y después volver a sentarse.
6. Probar pausa, reanudación, recorrido del tiempo y una ventana estrecha.

Visor activo: http://127.0.0.1:8898/

## Archivos

- `El_Dirto_Continuous.blend`: fuente editable con siete clips del personaje y acciones `Ball_*` sincronizadas. Para revisar el tiro, seleccionar `Shot` en `RIG_Controls_D05` y `Ball_Shot` en `Ball_Motion`. Fotogramas 1–253 a 24 fps.
- `visor/`: prueba web compilada. Servir esta carpeta por HTTP.
- `muestras/`: imágenes de los movimientos aprobados y las etapas del lanzamiento.
- `validacion/`: resultados de comprobación del recorrido, enlaces, exportación y pruebas de la aplicación.

## Comprobaciones

Se revisa el recorrido del balón contra cabeza, sudadera, piernas, zapatos, banca, bolso, aro, red y puente, incluyendo cuatro muestras por fotograma. Los controles de brazos y piernas se verifican a 48 muestras por segundo. Se comprueban los enlaces de las poses, la ejecución única del tiro y las solicitudes de cambio mientras el balón está en el aire.

La malla conserva los 67.406 triángulos del personaje original. El balón y el entorno conservan su geometría y materiales. Las imágenes de revisión proceden del archivo nativo de Blender.
