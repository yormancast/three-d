# Validación de fase 6

22 de octubre de 2026. Registro de F6-00 sobre el árbol de trabajo local, en `/Users/yorman/Projects/Repos/three-d`, con cambios locales previos sin commit. Referencia Git: `5409bd8`. F6-00 se completó con las limitaciones documentadas; la medición física móvil queda para F6-07.

## Línea base disponible

- Equipo: MacBook Air (Mac15,13), Apple M3 de 8 núcleos CPU y GPU de 10 núcleos, 16 GB de RAM. macOS 15.5; Node `v20.20.2`, npm `10.8.2`.
- Navegador: Chrome `155.0.0.0`, ventana de invitado. Perfil de red: localhost sin limitación artificial; DevTools mantuvo la caché desactivada durante las tres recargas. El equipo estaba alimentado por batería; nivel de carga, modo de energía y temperatura no quedaron registrados. DevTools estuvo abierto y acoplado durante las muestras de cuadros, por lo que son una referencia diagnóstica con posible coste de instrumentación.
- Recurso activo: `public/models/continuous/dirto-continuous.glb`, 15.449.252 bytes; SHA-256 `6505a219d8834c80997a1a78222ed57dc99e921efcbcde434396e6a1753163bc`.
- Build de producción: `npm run build` aprobado. JavaScript principal 762,63 kB (203,91 kB gzip), CSS 16,48 kB (4,07 kB gzip), HTML 0,76 kB (0,41 kB gzip). Vite mantiene su aviso de chunk JavaScript superior a 500 kB.
- El informe de `gltf-transform inspect` identifica las tres texturas del balón en 2048×1024: base color PNG 2,84 MB, normal PNG 4,03 MB y roughness PNG 1,41 MB. Total informado: 8,28 MB. El mismo informe estima 342.606 vértices por pasada de render y 98.319 vértices subidos.
- Carga en `http://127.0.0.1:4173/#home`: tres navegaciones completas duraron 261,2 ms, 289,4 ms y 219,9 ms (mediana 261,2 ms). `DOMContentLoaded` quedó en 164,6 ms, 283,4 ms y 212,3 ms. En las tres, el recurso GLB tardó 45 ms, 44 ms y 45 ms; `transferSize` fue 15.449.552 bytes por las cabeceras y el cuerpo transferido/decodificado fue 15.449.252 bytes. El bundle JS se transfirió en 36 ms y 35 ms en las dos lecturas disponibles, con 202.738 bytes transferidos y 762.639 bytes decodificados. Son tiempos de recurso y navegación local; no son tiempos de una red externa ni una medición completa hasta el primer frame.
- Viewport estrecho en escritorio: 645×858 CSS px, DPR 2 (calidad de escena `mobile`). Una muestra de 30 s en Home registró 44,9 FPS, p95 de 33,8 ms y máximo de 34,3 ms.
- Viewport ancho de Chrome: 1200×558 CSS px, DPR 2 (calidad `desktop`). Muestras de 30 s por vista, con la animación activa:

| Vista / recorrido | FPS observado | p95 de intervalo | Máximo | Intervalos >33,3 ms | Intervalos >50 ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 31,5 | 50,0 ms | 50,9 ms | 509 | 27 |
| Bio | 25,3 | 50,1 ms | 66,6 ms | 670 | 55 |
| Projects | 25,0 | 50,1 ms | 66,7 ms | 633 | 73 |
| Experience | 25,1 | 50,2 ms | 66,7 ms | 555 | 72 |
| Contact | 25,1 | 50,1 ms | 66,7 ms | 550 | 71 |
| Navegación con Rise y retorno | 25,5 | 50,1 ms | 100,0 ms | 536 | 72 |

- Al terminar la carga se observaron 328.481 triángulos, 41 draw calls, `submissionMs` de 0,4 ms y alrededor de 203 MB en `performance.memory.usedJSHeapSize`. Este heap incluye la instrumentación del navegador y no representa memoria de GPU; `submissionMs` mide solo una parte del coste del frame.

## Mediciones pendientes

No se midió por separado el instante exacto del primer frame 3D presentado ni una caché caliente. El perfil se ejecutó en localhost; su transferencia rápida no predice una descarga real con red lenta. `requestAnimationFrame` registra cadencia del navegador con DevTools abierto, no una captura de presentación de GPU. La revisión posterior deberá repetir estas mediciones con el panel cerrado o una herramienta externa y las condiciones de energía registradas.

No hay móvil físico disponible en esta sesión. La emulación de viewport no se usará como sustituto de una medición física; F6-07 deberá añadir resultados del móvil físico. Las metas heredadas siguen siendo objetivos, no resultados: primera imagen en menos de 2 s, aproximadamente 60 FPS en portátil medio y al menos 30 FPS en móvil medio.

## Avance F6-01 — 24 de octubre de 2026

- Implementación local: breakpoint compartido de 800 px, perfil separado para layout compacto/orientación/calidad y actualización de perfil al redimensionar, rotar o cambiar el tipo de puntero. Se añadió `viewport-fit=cover` y soporte para áreas seguras en la UI pública y el visor.
- Regresión: `npm run check` aprobó 49 pruebas, incluida la selección de perfil en 799/800 px, horizontal compacto con puntero grueso y orientación vertical independiente del layout. `npm run build` aprobó; el bundle principal quedó en 763,35 kB (204,13 kB gzip), CSS 16,77 kB (4,11 kB gzip). Vite mantiene el aviso de chunk superior a 500 kB.
- Revisión visual realizada en Chrome de escritorio con Bio abierta, navegación de las cinco secciones visible y escena 3D cargada, a viewport 1200×558 CSS px y DPR 2. No se observó contradicción en esa configuración.
- Pendiente para cerrar F6-01: inspección visual de 699/700 y 799/800 px, 390×844, 844×390, 390×480, 1280×480 y 1280×720; conservar selección y estado de pausa tras rotación; revisar áreas seguras con barras del navegador. Las pruebas de perfil verifican la clasificación, pero no sustituyen esa revisión de composición.

## Avance F6-02 — 24 de octubre de 2026

- Cambios: el panel compacto usa el espacio entre los controles superiores e inferiores; se retiró el máximo fijo de `48svh`. El texto de títulos, párrafos, enlaces y chips puede partirse para evitar desbordamiento; los controles táctiles clave tienen un mínimo de 44 px y los rótulos usan unidades relativas.
- Verificación: `npm run check` aprobó (11 archivos de prueba, 49 pruebas); `npm run build` aprobó. Bundle principal 763,35 kB (204,12 kB gzip); CSS 17,35 kB (4,22 kB gzip). Sigue el aviso de Vite sobre el chunk superior a 500 kB.
- Inspección de producción a zoom real de navegador 200 %: Bio se mantiene legible y dentro del panel desplazable. Esta observación no demuestra ausencia de desbordamiento en 320 px ni ampliación de texto del sistema.
- Pendiente: cinco vistas, 320 px, controles finales por teclado, llegada al final del scroll, contenido largo y enlace extenso temporales, y ampliación de texto. La prueba de teclado se interrumpió al cambiar Chrome de sección. No se conservó contenido de prueba.

## Avance F6-03 — 24 de octubre de 2026

- Se sustituyó el porcentaje sintético por un `<progress>` indeterminado accesible. La API de escena ya no emite progreso por cantidad de recursos, porque eso no medía bytes. Las etiquetas de carga y reintento admiten inglés en el visor técnico.
- `npm run check` y `npm run build` aprobaron con 56 pruebas. En una copia aislada del build se retiró el GLB: `#contact`, el texto, navegación y botón de reintento permanecieron utilizables. Se restauró el archivo y el reintento recuperó la escena manteniendo `#contact`; la reproducción, activa antes del fallo inicial, también quedó activa.
- Pendiente: inducir WebGL realmente deshabilitado, fallo después de pausar y reintento conservando esa pausa; repetir movimiento reducido y retorno desde pestaña oculta. La comprobación del GLB no sustituye estos casos.

## Avance F6-04 — variante de texturas adoptada

- Candidato aislado: texturas `Ball_*` reducidas de 2048×1024 a 1024×512 y recomprimidas dentro del GLB; no se cambiaron las cinco texturas WebP del entorno, geometría ni morph targets. El inspector lista los mismos siete clips y duraciones. Al cargar la variante en el sitio, el contrato del reproductor validó nodos, pistas, metadata y morphs.
- Comparación visual en Chrome de escritorio, 1280×720, vista Projects, con el balón visible: no se percibió degradación frente al archivo original. Es una inspección de escritorio, no de detalle en dispositivo móvil.
- GLB público final: 9.414.840 bytes frente a 15.449.252 bytes de línea base (−39,1 %). SHA-256: `a65517b2c8108d5a7fcbbe7ff6735070323de05d2f4035d9670dd3341084b1dc`. Las texturas del balón pasan de 8,29 MB a ~2,50 MB de tamaño de archivo y de 33,54 MB a ~8,39 MB de memoria GPU estimada. Son estimaciones de glTF-Transform; no se midió memoria real de GPU.
- `gltf-transform validate` reporta cero errores para original y variante, y las advertencias del original sobre espacio tangente generado y extensión Meshopt no soportada por el validador. El candidato además menciona accessors posiblemente sin uso. La app carga la variante y sus pruebas de recurso pasan; conservar la entrada fuente original en `models/` (ignorada) y actualizar solo `public/` fue deliberado.

## Avance F6-05 — división del motor

- Se difirió `createScene` con import dinámico y guardas de generación/desmontaje antes de crear la instancia. En build, la entrada pasó de 763,17 kB (204,06 kB gzip) a 83,40 kB (32,28 kB); chunk 3D: 680,60 kB (172,14 kB gzip). El total comprimido queda similar, ahora distribuido entre dos chunks. Vite conserva el aviso del chunk 3D >500 kB.
- Esto reduce lo que bloquea la entrada inicial, pero no se midió tiempo a HTML interactivo ni a primer frame con corridas frías comparables. No se afirma una reducción del tiempo total de carga.

## Avance F6-06 — recorrido final observado

- Build de producción: Home → Bio → Projects → Experience → Contact → Home; cada vista actualizó el hash y el contenido. La pausa se mantuvo mientras se navegó entre Bio y Contact. `?review=1` en producción mostró solo controles públicos; no habilitó controles técnicos. El modelo candidato cargó en Projects.
- Pendiente: matriz visual de F6-01, rotación con pausa y selección preservadas, 320 px/zoom/texto extendido, Shot en visor de desarrollo, movimiento reducido, pestaña oculta y ausencia real de WebGL. No se exportaron capturas nuevas al repositorio.

## Avance F6-07 — verificación local final

- `npm run check`: aprobado, 11 archivos de prueba y 56 pruebas. `npm run build`: aprobado. Bundle de entrada 83,40 kB/32,28 kB gzip; motor 680,60 kB/172,14 kB gzip; GLB público 9.414.840 bytes.
- No se repitieron tres navegaciones frías, caché caliente, muestreo de 30 s por vista, recorrido Rise/retorno, memoria ni primer frame bajo el perfil F6-00. No hubo móvil físico disponible y no se trató el viewport emulado como medición física. F6 permanece parcial hasta completar estas mediciones y las pruebas visuales/funcionales señaladas.

## Referencias

- [Plan detallado y tareas de fase 6](tareas-fase-6.md).
- [Plan general v3](plan-v3.md).
- [Validación de fase 5](fase-5-validacion.md).

## Continuación — 25 de octubre de 2026

La preparación de fase 7 detectó y corrigió selectores móviles que se compilaban sobre el contenedor equivocado. Se recorrieron las cinco vistas en diez tamaños, incluido 320 px y los límites 699/700 y 799/800; sin desbordamiento horizontal tras corregirlos. Se validaron error/reintento del GLB, teclado al último enlace, contenido extenso en copia aislada, cambio de orientación equivalente conservando pausa/sección y Shot/retorno en desarrollo. Se añadieron tres regresiones del composable. Ver [registro detallado, evidencia y límites](fase-7-validacion.md).

No se acredita el cierre de F6: siguen pendientes móvil físico, mediciones controladas, áreas seguras reales, zoom/texto ampliado final, WebGL deshabilitado, fallo posterior a pausa integrado, movimiento reducido y pestaña oculta.

## Recuperación y mediciones posteriores — 25 de octubre

Se corrigió una pérdida real de contexto que dejaba la escena en ready sin reintento. La recuperación con canvas nuevo conserva sección y pausa, y pasó tres ciclos reales. Movimiento reducido, zoom real y pestaña oculta también fueron comprobados. Hay 61 pruebas aprobadas y una instalación independiente con check/build aprobados. Las muestras de 30 s quedaron en 23–30 FPS; el candidato sin MSAA se rechazó por dientes de sierra. Móvil físico, WebGL inicial deshabilitado, primer frame GPU, memoria aislada y la desviación de rendimiento mantienen abierta la fase. Ver [registro actualizado](rendimiento-local.md).
