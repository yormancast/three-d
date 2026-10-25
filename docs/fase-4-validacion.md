# Validación de fase 4 — Home + Bio

21 de octubre de 2026. Validación integrada del árbol de trabajo local de `/Users/yorman/Projects/Repos/three-d`. El árbol contiene cambios locales de las fases 3 y 4; no se atribuye este resultado a un commit ni se creó uno para esta revisión.

## Estado

**Fase 4 completada el 21 de octubre de 2026.** El recorrido Home + Bio, el contenido confirmado y las verificaciones integradas descritas abajo están implementados y documentados. Se verificó el estado sin WebGL y se guardaron capturas de escritorio, móvil y fallo de WebGL en `docs/evidencia/fase-4/`.

## Entorno y comandos

- Build de producción local servido en `http://127.0.0.1:4173/`.
- `npm run check`: aprobado; formato, lint, TypeScript y pruebas existentes (46 pruebas en 10 archivos).
- `npm run build`: aprobado. El paquete JavaScript principal es 759.14 kB (202.76 kB gzip), por encima del umbral configurado de 500 kB; Vite conserva su aviso de tamaño. No se trató ese aviso como fallo de build.
- Viewports comprobados: 1280×720, 390×844 y, para lectura en altura reducida, 390×480. F4-03 también registra 1280×480, 799/800 px y el caso equivalente a zoom 200 % (640×360).
- La consola de producción no mostró errores ni avisos durante los recorridos comprobados.
- Las capturas desktop/móvil con escena se generaron en Chrome headless con WebGL por software (SwiftShader). Bio móvil se inspeccionó además en el navegador integrado con Archivo cargada; a 390×844 la tarjeta ocupa x=12–378 px (366 px), el cuerpo mide 328 px y no presenta desbordamiento horizontal. El título, párrafo, chips, cierre y navegación caben en el viewport.

## Recorrido público y contenido

- `/?review=1` abre Home público en producción; el parámetro no expone el visor de revisión.
- Home → Bio → Home funciona por selección y por teclado. Escape y el botón de cierre vuelven a Home; el foco termina en el título de la sección activa, con indicador visible.
- La entrada directa a `#bio` enfoca el título de Bio. Atrás y adelante restauran el hash, el contenido y la sección activa esperados.
- Bio presenta el texto y los chips aprobados, sin enlaces no confirmados. En 1280×720 y 390×844 el texto completo cabe; a 390×480 el cuerpo se desplaza dentro de la tarjeta y el cierre y navegación siguen alcanzables.
- Se revisaron Home y Bio frente a las referencias en 1280×720 y 390×844. Escritorio conserva la firma YORMAN C., navegación en píldora arriba a la derecha, tarjeta a la derecha y conector al borde izquierdo. En móvil, la tarjeta queda debajo del personaje y no aparece el conector. Rostro, manos y balón quedan libres de texto. Las cinco capturas revisadas están exportadas en `docs/evidencia/fase-4/`.

## Escena, recursos y estados de error

- La carga normal solicitó una vez `dirto-continuous.glb`. `preview.jpg` también cargó.
- Se retiró temporalmente el GLB del directorio de build y se recargó Bio: el texto y la navegación siguieron utilizables y apareció el mensaje de escena no disponible con opción de reintento. Tras restaurar el mismo archivo, reintentar recuperó la escena. La suma SHA-1 del GLB público y del build restaurado coincidió (`6505a219d8834c80997a1a78222ed57dc99e921efcbcde434396e6a1753163bc`).
- Chrome se ejecutó con las opciones `--disable-webgl --disable-webgl2` y se abrió directamente `/?review=1#bio`. El DOM de producción registró `data-scene-status="error"`, el mensaje de escena no disponible, Try again, el titular y la navegación. La captura [Bio sin WebGL](evidencia/fase-4/no-webgl-bio.png) conserva ese estado visible y la Bio sigue utilizable.
- Carga lenta, selección durante la carga y una sola solicitud quedan documentadas en [validación de fase 3, F3-07](fase-3-validacion.md). Movimiento reducido y cámara con reproducción pausada quedan documentados en F3-07 y en [F4-04](tareas-fase-4.md#f4-04--revisar-composición-y-conector-con-bio-final); se conservó la pose y la transición de cámara terminó.

Capturas del recorrido: [Home escritorio](evidencia/fase-4/home-desktop.png), [Bio escritorio](evidencia/fase-4/bio-desktop.png), [Home móvil](evidencia/fase-4/home-mobile.png), [Bio móvil](evidencia/fase-4/bio-mobile.png) y [Bio sin WebGL](evidencia/fase-4/no-webgl-bio.png).

## Evidencia relacionada y cierre

- [Plan detallado y resultados por tarea](tareas-fase-4.md).
- [Plan general v3](plan-v3.md).
- [Validación integrada de fase 3](fase-3-validacion.md).

La comparación visual es una revisión técnica de las referencias y no representa aprobación artística del usuario. Esta emulación tampoco certifica FPS ni rendimiento en un teléfono físico. Fase 4 queda completada; no certifica rendimiento físico ni aprobación artística del usuario, que no eran criterios de cierre de esta fase.
