# Continuación de validación y rendimiento local

25 de octubre de 2026. Estos resultados complementan [la preparación de entrega](fase-7-validacion.md). Las fases 6 y 7 siguen parciales; este registro distingue pruebas reales de navegador, mediciones locales y casos aún pendientes.

## Recuperación gráfica corregida

Chrome 155 permitió inducir pérdida real de contexto con la extensión `WEBGL_lose_context`. Antes del cambio, el contexto indicaba pérdida y el canvas seguía anunciando `ready`, sin botón de reintento. El fallo ocurrió con la escena pausada.

Se añadió escucha de `webglcontextlost` en el composable. La pérdida invalida cargas antiguas, libera la escena y muestra el poster/error. Reintentar pide a Vue un canvas nuevo; la escena se carga al recibirlo y conserva sección, atmósfera y reproducción. Los listeners del canvas anterior se retiran. Las capas de RULES.md se conservan.

La repetición real en Contact registró `ready`, `playing=false`, `#contact`, un canvas y una instancia de canvas distinta tras reintentar. Tres ciclos adicionales cambiaron a Bio durante el error y conservaron `#bio` y la pausa en los tres reintentos. Ver `recovery-cycles` en el archivo de mediciones. La pérdida real de un contexto creado **no equivale a iniciar Chrome con WebGL deshabilitado**; ese caso permanece pendiente.

Se añadieron dos regresiones: sustitución del canvas con pausa/última selección y descarte de una carga que termina después de perder contexto. Con ellas pasan 61 pruebas en 12 archivos.

## Movimiento reducido, zoom y pestaña oculta

- En DevTools → Rendering se emuló `prefers-reduced-motion: reduce` y se recargó el build. La consulta del navegador devolvió `true`, la escena quedó `ready`, `playing=false` y tiempo cero. Bio, Projects, Experience, Contact y Home conservaron tiempo cero, poses correspondientes y un canvas. Se retiró la emulación tras la prueba.
- Zoom **real de Chrome al 200 %**, confirmado en la barra del navegador: Home → Bio → Projects → Experience → Contact → Home. Tab alcanzó los botones finales de Bio/Projects/Experience y el enlace de Contact; Escape regresó a Home. Hay capturas de Bio, Projects y Contact.
- Se ensayó la emulación de escala de texto de DevTools al 200 %, pero la lectura CSS inicial siguió en 16 px: no se presenta como ampliación efectiva del sistema. Se aplicó temporalmente `font-size:200%` en la raíz del documento para comprobar aumento efectivo del texto; el último control de Bio continuó accesible con teclado. La navegación posterior eliminó esta modificación. La ampliación del sistema en móvil real sigue pendiente.
- Instrumentación temporal de las cuatro llamadas comunes de dibujo WebGL2: 0 llamadas en 1.500 ms pausado, con tiempo de animación constante; 0 llamadas en 4.000 ms con la pestaña realmente oculta, preferencia de reproducción activa y tiempo constante. Al volver, se registraron 1.148 llamadas en 1.200 ms y el tiempo avanzó. El conteo positivo verifica que la instrumentación detecta el dibujo normal. Se restauraron los métodos originales al terminar cada muestra; no se instrumentaron así las muestras de FPS.

## Condiciones de medición

MacBook Air M3 de la línea base, macOS 15.5, Chrome 155.0.0.0 en invitado, zoom 100 %, viewport 1710×897 CSS px, DPR del dispositivo 2, puntero fino y perfil desktop. El renderer limita su DPR a 1,25. Navegación sobre HTTP local, sin limitación artificial y sin compresión de este servidor de prueba. No representa red externa ni móvil.

Se sirvió el build con un script temporal añadido antes de la entrada, sin modificar los archivos distribuidos. Los datos se enviaron únicamente al servidor en 127.0.0.1 y se guardaron localmente. Los scripts empleados se conservan como texto en la carpeta de evidencia. Deben copiarse y adaptar sus rutas si se repite el protocolo en otra máquina.

El sistema indicó alimentación AC; la primera lectura mostró 17 % y descarga, y una lectura posterior 12 % cargando. El modo de bajo consumo del sistema estaba desactivado. Chrome mostraba ahorro de energía al principio de la sesión y dejó de mostrarlo antes de las muestras de cuadros. No se registraron temperatura ni frecuencia de GPU. Estas condiciones impiden homologar el resultado como rendimiento garantizado o comparar directamente con la línea base de 1200×558 con DevTools abierto.

## Carga sin caché

`Cache-Control: no-store` en el servidor de prueba. Tres navegaciones con viewport final 1710×897; se excluye una primera navegación diagnóstica al 200 %.

| Ejecución | Contenido disponible (ms) | Estado ready (ms) | Ready + dos rAF (ms) | GLB (ms) |
| --- | ---: | ---: | ---: | ---: |
| 1 | 129.5 | 850.7 | 854.3 | 14.2 |
| 2 | 163.8 | 926.7 | 930.4 | 14.0 |
| 3 | 181.8 | 903.0 | 906.5 | 21.0 |

Mediana de `ready`: 903.0 ms. `ready + dos rAF` es una referencia posterior a la preparación, **no mide presentación del primer frame por la GPU**. No se acredita el objetivo del primer frame físico con este proxy. El GLB transfirió 9.414.840 bytes de cuerpo en cada navegación.

Se intentó una repetición con caché tras precargar recursos: JavaScript y CSS reportaron `transferSize=0`, pero el GLB volvió a transferirse completo. El estado ready llegó a 1.024,7 ms. Esto acredita una navegación de caché mixta, **no una carga caliente del GLB** ni una mejora de velocidad. Su política de caché debe comprobarse en el hosting real.

## Cadencia por vista

Se dejó estabilizar cada selección y luego se muestrearon intervalos `requestAnimationFrame` durante 30 s. DevTools quedó cerrado antes de empezar; las muestras reportan pestaña visible y viewport final constante. El campo `initialEnvironment` de los datos crudos corresponde al momento de programar el recorrido con DevTools todavía abierto, antes de la espera inicial. Se usa `environment` para el viewport de cada muestra. En Navigation se alternaron Experience/Contact/Projects/Bio cada 1,5 s.

| Vista | FPS rAF | p95 (ms) | Máximo (ms) | Pestaña oculta durante muestra |
| --- | ---: | ---: | ---: | --- |
| Home | 29.8 | 50.0 | 51.1 | No |
| Bio | 23.7 | 50.9 | 66.7 | No |
| Projects | 24.4 | 50.7 | 51.0 | No |
| Experience | 23.5 | 50.8 | 67.5 | No |
| Contact | 23.7 | 50.8 | 116.8 | No |
| Navigation | 23.5 | 50.9 | 83.7 | No |

Son intervalos de la cola de animación del navegador, no cuadros presentados medidos en GPU. La meta de aproximadamente 60 FPS en portátil **no se alcanzó en estas condiciones**. El ahorro del GLB y del bundle inicial no demuestra mejora de estos cuadros.

## Candidato de rendimiento rechazado

Se construyó en la copia aislada una variante que cambió únicamente `samples:4` a `samples:0` en el render target de postproceso, manteniendo DOF, bloom, modelo y resolución. No se aplicó a `src/scene/postprocessing.ts` del proyecto.

| Vista | Base, MSAA 4 | Candidato sin MSAA | Cambio observado |
| --- | ---: | ---: | ---: |
| Home | 29.8 FPS | 36.1 FPS | +20.8 % |
| Bio | 23.7 FPS | 29.1 FPS | +22.7 % |

La comparación visual a la misma pose y cámara en Bio muestra dientes de sierra evidentes en las ranuras de la banca y bordes del personaje sin MSAA. El candidato no alcanza 60 FPS y pierde calidad; se conserva MSAA 4. Son muestras únicas, no un estudio estadístico. El siguiente perfil debería aislar el coste del pase de profundidad/DOF y evaluar alternativas que conserven la dirección visual, antes de reducir calidad general.

## Memoria y entrega reproducible

En tres recuperaciones, el heap JS disponible pasó por 418,1 / 420,2 / 430,3 MB decimales. No se forzó GC ni se aisló retención por DevTools: el aumento no demuestra una fuga ni permite acreditar estabilidad de memoria. Tampoco representa memoria GPU. La verificación de memoria física sigue pendiente.

Se creó una copia de todos los archivos versionados/no ignorados en `/tmp/three-d-release-validation`, sin reutilizar node_modules, y se ejecutaron instalación offline desde lockfile, check y build con Node 20.20.2. Aprobaron las 61 pruebas y el build. La primera ejecución tomó Node 16 del PATH fuera del repositorio y falló en ESLint por falta de structuredClone; se repitió con la versión Node documentada. Esto verifica el snapshot local, todavía no un checkout limpio de un commit nuevo. La variante MSAA 0 se construyó después en esa copia y no es el resultado aprobado para entrega.

## Evidencia y límites que permanecen

Los JSONL preservan resultados crudos y ejecuciones diagnósticas, con fechas UTC. Las capturas están en `docs/evidencia/fase-7/`: zoom, texto ampliado, pérdida de contexto y comparación MSAA. La instrumentación y los servidores temporales no forman parte de la UI pública.

Siguen pendientes: móvil físico, WebGL deshabilitado desde el inicio, primer frame presentado por GPU, carga caliente completa del GLB/red de hosting, memoria tras GC/GPU, y una solución o aceptación explícita de la desviación de 60 FPS. Revisión artística final y publicación tampoco se dan por aprobadas.

## Estabilidad del CSS de entrega

La copia aislada y los nuevos archivos de evidencia cambiaban el CSS generado pese a mantener la UI: Tailwind estaba detectando palabras de los documentos como utilidades. Se restringió su detección a `src/` y `index.html` en la entrada de estilos, siguiendo la [configuración oficial de fuentes](https://tailwindcss.com/docs/detecting-classes-in-source-files#setting-your-base-path). La evidencia y los registros dejan de influir en los estilos distribuidos. Esta corrección no modifica el motor 3D ni invalida la comparación de MSAA.
