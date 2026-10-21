# El Dirto — Dribble y Crossover sobre la escena actual

19 de octubre de 2026. Muestra para revisión artística.

## Alcance confirmado

Se anima el personaje nativo que ya estaba sentado en la escena, junto con el balón original de esa escena. Se conserva la banca y el entorno. La animación de descanso aprobada continúa disponible como «Descanso».

`el_dirto_v11.glb` y `docs/animaciones-balon.md` se utilizaron como referencia de movimiento. No se incorporó su personaje, su rig ni su balón.

## Animaciones

| Muestra | Duración | Muestreo | Movimiento |
| --- | --- | --- | --- |
| Descanso | Clip aprobado existente | Sin cambios en el recurso original | Respiración suave, mirada al frente |
| Dribble | 2,375 s | 57 fotogramas + cierre, 24 fps | Cinco botes de distinta altura con la derecha; mano izquierda en la postura de apoyo |
| Crossover | 3,167 s | 76 fotogramas + cierre, 24 fps | Dos botes derechos, cruce delante de los pies, dos izquierdos y regreso |

Los dos nuevos clips cierran con la misma geometría del primer fotograma. Se animaron los controles del rig nativo, incluida una pequeña variación del torso y el apoyo de las manos. En el relevo, las manos describen un arco corto hacia delante para que las mangas no rocen el pantalón.

El balón conserva la geometría, las costuras, el material y el atlas de la escena actual. Se separó del conjunto estático de objetos para moverlo como un objeto independiente. Conserva su radio de aproximadamente 12 cm; se aplasta un 14 % en el impacto y gira una vuelta alrededor del eje vertical por bucle. Vuelve a su lugar original al seleccionar Descanso.

Las trayectorias se adaptaron a las proporciones reales de esta escena. Las alturas del centro en Dribble son 0,45 / 0,40 / 0,38 / 0,42 / 0,53 m. El cruce pasa por delante de los pies, con el centro adelantado hasta Y = −0,78 m en Blender. La vista y el entorno existentes se conservan.

## Archivos de prueba

- `source/Dribble.blend` y `source/Crossover.blend`: escena nativa editable con el rig, personaje y balón actuales. Reproducir desde el fotograma 1; el último es el cierre repetido.
- `export/Dribble-web.glb` y `export/Crossover-web.glb`: deformación del mismo personaje preparada para la revisión web.
- `export/entorno-ball-web.glb`: entorno original con su balón separado; conserva los atlas y materiales existentes. No se rediseñó la escena.
- `app/`: visor con selector Descanso / Dribble / Crossover, pausa y barra de tiempo. El movimiento del balón y el personaje se reproduce en un único reloj de animación.
- `inspection/`: muestras renderizadas e informes de comprobación.
- `scripts/`: preparación reproducible y verificaciones.

Visor local de esta entrega: http://127.0.0.1:8898/. La app principal también recibe los mismos cambios.

## Comprobaciones realizadas

- Dribble: 115 muestras a intervalos de medio fotograma. Crossover: 153 muestras. Sin intersecciones de manos, puños o mangas con el pantalón en esas muestras.
- Distancia mínima balón–pantalón: aproximadamente 15,1 cm en Dribble y 14,9 cm en Crossover.
- Distancia mínima entre la superficie de las manos y la esfera nominal: 1,28 mm y 0,71 mm respectivamente. Estas medidas no certifican todos los instantes continuos.
- Inicio y cierre del personaje: coincidencia exacta en las muestras nativas.
- Se preservan los 67.406 triángulos del personaje. La exportación reproduce la deformación evaluada del rig, incluidos sus correctivos; reducción previa a cuantización con error máximo inferior a 0,25 mm.
- Recursos web: aproximadamente 413 KB (Dribble), 739 KB (Crossover) y 676 KB (entorno con balón separado).
- Carga de los GLB y reproducción con el mezclador de Three.js verificadas sin navegador: tiempos, escala del balón, posición y suelo. El error numérico de posición del balón es menor de 0,001 mm.
- App: formato, lint, tipos y cinco pruebas aprobados. Build aprobado, con el aviso existente de tamaño del paquete de Three.js.
- Muestras visuales renderizadas y revisadas en Blender.

## Pendiente de revisión

La aprobación artística de las dos nuevas animaciones está pendiente. El selector muestra muestras independientes y reinicia cada bucle; todavía no se diseñó una transición coreografiada entre descanso y dribleo.

La comprobación visual automática en navegador no se pudo realizar: la herramienta de navegador no logró verificar su política de acceso. No se certifican aquí el aspecto final con los efectos web ni el rendimiento en dispositivos físicos. La iluminación horneada del entorno se conserva; no se volvió a hornear al mover el balón.
