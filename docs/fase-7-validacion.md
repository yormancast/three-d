# Preparación de entrega — fase 7

25 de octubre de 2026. Trabajo sobre `version-3`, referencia `5409bd8`, con cambios previos de fases 3–6 sin commit. La entrega sigue local: no se ha publicado ni creado un commit que incorpore automáticamente todo el árbol de trabajo.

## Cambios realizados

- Corregidos los selectores móviles de identidad, tarjeta y navegación. La forma anterior `:global(parent) child` compilaba a una regla aplicada únicamente al padre; se verificó el CSS generado y el fallo en el navegador a 320 px. Ahora el selector completo queda dentro de `:global(...)`.
- El layout compacto reserva filas para tarjeta, aviso de carga/error y navegación. La tarjeta queda abajo, limita su altura al espacio disponible y permite desplazamiento interno. El aviso y el reintento ya no quedan detrás de la tarjeta.
- Enlaces largos pueden ocupar varias líneas y la lista permite envolver elementos. Reintento tiene al menos 44 px de altura y texto relativo.
- El visor de desarrollo permite alturas inferiores a 480 px sin forzar desplazamiento de página. Se ajustó la separación de controles al garantizar botones de 44 px.
- Documento público en inglés, título y descripción profesional, Open Graph y tarjeta social. Se reutiliza el poster existente (1280×800). La URL absoluta usa el dominio documentado del proyecto, `yormancastellanos.com`; su disponibilidad en el despliegue y la vista previa de redes requieren verificación después de publicar.
- Tres pruebas de regresión del composable: pausa y última sección tras fallo/reintento, inicio/reintento con preferencia de movimiento reducido y rechazo de una carga obsoleta después de una recuperación exitosa. Estas pruebas no equivalen a emular la preferencia en un navegador real.

## Navegador y matriz

Build de producción servido en `http://127.0.0.1:4173/`, navegador integrado del escritorio. Viewport CSS emulado; no es dispositivo móvil ni zoom real. Los datos son del DOM y atributos públicos del canvas, sin modificar estado interno del reproductor.

Se recorrieron Home → Bio → Projects → Experience → Contact en estos diez tamaños:

| Tamaño | Layout esperado | Resultado funcional |
| --- | --- | --- |
| 320×568 | Compacto | Sin desbordamiento horizontal; tarjeta desplazable |
| 699×720 | Compacto | Cinco vistas y un canvas |
| 700×720 | Compacto | Cinco vistas y un canvas |
| 799×720 | Compacto | Cinco vistas y un canvas |
| 800×720 | Escritorio | Cambio coherente de tarjeta y navegación |
| 390×844 | Compacto vertical | Cinco vistas y un canvas |
| 844×390 | Compacto horizontal | Controles y tarjeta dentro del viewport |
| 390×480 | Compacto de poca altura | Scroll interno disponible |
| 1280×480 | Escritorio de poca altura | Tarjeta limitada y navegación disponible |
| 1280×720 | Escritorio | Cinco vistas y un canvas |

La primera matriz detectó el fallo de selectores. Tras corregirlo se recorrieron las 50 combinaciones sin desbordamiento horizontal; se ajustó posteriormente la tarjeta para que su contenido corto se apoye abajo en lugar de llenar toda la fila. La comprobación final y capturas cubren el estado final. Los datos de geometría no son aprobación artística de los encuadres.

## Fallo, reintento y teclado

- Se retiró temporalmente **solo el GLB del build**, preservando el recurso fuente. En 320×568, Contact y el aviso de error quedaron visibles, sin desbordamiento horizontal. El centro del reintento correspondía al propio botón al consultar el elemento bajo ese punto.
- Tab desde cerrar desplazó la tarjeta hasta LinkedIn, con el enlace dentro de sus límites. Se navegó entre Bio y Contact durante el fallo.
- Tras restaurar el GLB del build, Try again recuperó `ready` conservando `#contact` y un canvas. No fue un fallo posterior a una pausa en el navegador: ese caso se cubrió con regresión del composable y sigue pendiente de prueba integrada.
- Se pausó y se cambió de 320×568 a 844×390: `#contact`, `playing=false` y un canvas se conservaron. Es redimensionamiento equivalente a giro, no una rotación con barras/áreas seguras de un móvil real.
- Copia aislada del build en `/tmp`, servida temporalmente en el puerto 4175: Bio con 300 repeticiones de un párrafo y Contact con una etiqueta de enlace sin espacios de más de 500 caracteres. En 320 px no apareció desbordamiento horizontal de página ni tarjeta. Tab alcanzó el botón final de Bio con scroll interno superior a 7.000 px. El enlace muy alto se envuelve y requiere desplazamiento para leerlo completo. Los datos temporales nunca se incorporaron a `src/content/`.

## Visor de desarrollo

En `http://127.0.0.1:5173/?review=1` se solicitó Shot desde Recovery, se observó su ejecución y retorno automático a Standing; después se repitió desde Standing, con pausa, cambio vertical/horizontal y reanudación. El visor horizontal ya no necesita desplazar el documento para alcanzar controles inferiores. El sitio público conserva Shot fuera de su interfaz.

## Evidencia

Capturas JPEG en [evidencia/fase-7/](evidencia/fase-7/). `stress-320.jpg` contiene datos artificiales de la copia aislada; no representa contenido publicable. Los nombres de captura describen el caso, no una aprobación visual. La captura de error se repitió sobre el build final: reintento accesible con altura de 44 px. `matriz.json` conserva las 50 comprobaciones de geometría del estado final; ninguna registró desbordamiento horizontal de página/tarjeta, tarjetas fuera del viewport ni más de un canvas.

## Recursos y contenido

- GLB público: 9.414.840 bytes, SHA-256 `a65517b2c8108d5a7fcbbe7ff6735070323de05d2f4035d9670dd3341084b1dc`, conservado.
- Procedencia y licencias ya inventariadas en `public/models/README.md` y `docs/assets/`; no se añadieron recursos externos nuevos.
- Experience permanece vacía y los textos autorizados de v1 se conservan. No se hizo revisión editorial ni se inventó trayectoria.
- Se mantienen los enlaces existentes de LinkedIn y Sketchfab. No se probó el servicio de destino ni se enviaron mensajes.

## Pendientes para cierre

Actualización: la continuación ya comprobó movimiento reducido en Chrome, zoom real al 200 %, pestaña oculta y pérdida real de contexto después de pausar, con corrección y reintento. También hay tres cargas sin caché, muestras de 30 s por vista y validación en instalación independiente. Ver [resultados, candidato rechazado y límites de las mediciones](rendimiento-local.md).

- Móvil físico: rendimiento, red, temperatura/energía, áreas seguras, ampliación del sistema y barras del navegador.
- WebGL realmente deshabilitado desde el inicio; no confundir con la pérdida de un contexto ya creado.
- Primer frame presentado por GPU, memoria aislada y caché caliente completa del GLB/hosting.
- Aproximadamente 60 FPS en portátil: no alcanzados en la muestra local; falta optimizar sin degradar la imagen o aceptar explícitamente la desviación.
- Revisión visual artística final, confirmación del dominio de despliegue y vista previa social tras publicación.
- Consolidación deliberada en Git y comprobación desde checkout limpio antes de publicar.

Fase 6 y fase 7 permanecen parciales. No se necesita cambiar el contenido editorial para completar las pruebas técnicas pendientes.

## Comprobaciones finales

`npm run check` aprobado: formato, lint, tipos y 59 pruebas en 12 archivos. `npm run build` aprobado: entrada 83,40 kB (32,28 kB gzip), motor 680,60 kB (172,14 kB gzip), CSS 17,92 kB (4,28 kB gzip), HTML 1,59 kB. Se mantiene la advertencia de Vite por el chunk 3D superior a 500 kB. No es un fallo de build ni demuestra un tiempo de carga aceptable.

Se revisaron las capturas de Bio en vertical, horizontal y escritorio; el resto de la matriz conserva evidencia por tamaño. La UI pública y el recurso activo se mantienen disponibles en el build final.

## Continuación de recuperación y mediciones

Ver [registro de continuación](rendimiento-local.md). Se corrigió la recuperación ante pérdida de contexto con un canvas nuevo y se añadieron dos regresiones; check/build aprobaron con 61 pruebas. El alcance editorial se mantiene.
