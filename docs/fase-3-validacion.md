# Evidencia de validación — Fase 3

21 de octubre de 2026. Registro de la integración de coordinación y navegación. La revisión final amplía la evidencia con viewport estrecho, carga lenta y movimiento reducido. F3-07 queda completada.

## Comprobaciones automáticas

| Comprobación | Resultado |
| --- | --- |
| `npm run check` | Aprobado: formato, lint, typecheck y 46 pruebas en 10 archivos. El primer intento encontró formato y tres errores de lint en cambios recientes; se corrigieron y se repitió el check completo con éxito. |
| `npm run build` | Aprobado; chunk principal 758.50 kB, con aviso de Vite sobre el umbral de 500 kB |
| Bundle de producción | No contiene `SceneReview`, `review-footer` ni textos de controles técnicos |
| Integridad del modelo | SHA-256 de `public/models/continuous/dirto-continuous.glb` y `dist/models/continuous/dirto-continuous.glb` coincide: `6505a219d8834c80997a1a78222ed57dc99e921efcbcde434396e6a1753163bc` |

## Recorrido en navegador

**Entorno:** navegador integrado, build de producción. Revisión anterior a 1280×720; revisión actual a 390×844 con el control de viewport del navegador.

- Entrada directa en `#experience`: cargó la sección Experience; la escena terminó de cargar sin cerrar la navegación.
- Recorrido Home → Bio → Projects → Experience → Contact; cada título y hash coincidieron con la selección. El canvas permaneció visible durante las selecciones.
- Atrás y adelante cambiaron entre Experience y Contact, y restauraron contenido y hash.
- Cerrar desde Contact con Enter devolvió a Home y quitó la tarjeta.
- La ruta `#not-a-section` se normalizó a `#home`.
- La navegación estuvo disponible antes de completar la carga inicial.
- Fallo y reintento: se retiró temporalmente el GLB de `dist/`; una página nueva mostró el fallback con la sección Bio todavía abierta. Se restauró el archivo y el botón de reintento cargó la escena conservando Bio. El archivo público original no se modificó; el GLB restaurado coincide por SHA-256.
- La URL de producción `?review=1` mostró la pantalla pública. En F3-06 se comprobó también que `/` en desarrollo abre la vista pública y `/?review=1` abre el visor técnico.
- La selección rápida Bio → Experience dejó Experience seleccionada. No se inspeccionó el estado interno de los gates durante esa interacción.
- En 390×844, el menú y la tarjeta Bio permanecieron visibles y utilizables; el hash cambió a `#bio`. Escape cerró la tarjeta, volvió a `#home` y dejó el foco en Home. La entrada directa en `#experience` abrió esa sección y normalizó un hash desconocido a `#home`.
- Carga lenta controlada: servidor local retrasó 1,8 s el inicio de la respuesta del GLB. Desde `#experience` se seleccionaron Bio y luego Contact antes de completar la carga. El contenido cambió al instante, el canvas terminó en estado `ready` con Contact seleccionada y el servidor registró una sola solicitud de `dirto-continuous.glb` durante esa carga. La navegación no solicitó otra copia.
- En el build actual, `?review=1` continuó mostrando la vista pública en producción.
- Movimiento reducido: se activó temporalmente en Ajustes del sistema. El navegador informó `prefers-reduced-motion: true`; en Bio y Experience, el canvas quedó `ready`, `data-playing=false`, con Dribble y Standing respectivamente y sin transición pendiente. La navegación y el foco funcionaron. Se restauró Reducir movimiento a `off`, se recargó la página y se verificaron `prefers-reduced-motion: false` y reproducción normal activa.

## Límites de la validación

- El viewport estrecho se comprobó a 390×844; la emulación no certifica comportamiento ni rendimiento en un teléfono físico.
- La pantalla pública no ofrece una pausa manual; por eso el estado detenido se comprobó mediante movimiento reducido (`data-playing=false`) y la preferencia se restauró a su valor original al terminar.
- La validación no midió FPS, memoria ni rendimiento de un teléfono físico.

**Alcance del árbol probado:** el árbol de trabajo ya contenía archivos de fase 4 cuando se solicitó esta ejecución. Por ello, check/build y las pruebas de navegador verifican la integración presente, incluidas esas modificaciones, no un snapshot aislado de fase 3.

**Estado:** F3-07 completada. Check, build, navegación desktop y estrecha, enlaces directos, historial, cierre con teclado, carga lenta con una solicitud del modelo, fallback/reintento, movimiento reducido y visor inaccesible en producción aprobados. La emulación estrecha no sustituye la medición de rendimiento en un teléfono físico.
