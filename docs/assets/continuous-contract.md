# Contrato del recurso continuous

Contrato revisado desde `public/models/continuous/dirto-continuous.glb` el 24 de octubre de 2026. Este documento separa los requisitos que necesita el reproductor de los detalles descriptivos de la distribución web inspeccionada.

## Versiones

- `asset.version: "2.0"` identifica la versión de glTF usada por el contenedor. No versiona el metadata propio del proyecto.
- `scenes[scene].extras.formatVersion: 1` versiona el contrato de movimiento de El Dirto.
- `scenes[scene].extras.motionData` contiene los siete clips y su metadata de muestreo. `formatVersion` y `motionData` son propiedades hermanas dentro de `extras`.
- `asset.generator` y `extras.description` son descriptivos, no selectores de compatibilidad.
- Un consumidor del formato de movimiento 1 debe rechazar una versión ausente, no numérica o distinta de 1 con un error claro. Una exportación futura puede añadir otro formato mediante una migración deliberada del consumidor.

## Estructura requerida

La escena glTF seleccionada debe incluir estos nodos con nombre:

| Nodo | Requisito de uso |
| --- | --- |
| `ElDirto_Character` | Grupo con una malla que tenga morph targets y `morphTargetInfluences`. Sus clips modifican los pesos del personaje. |
| `ElDirto_Environment` | Grupo del entorno horneado. |
| `ElDirto_Emissives` | Grupo de elementos emisivos que reciben adaptación de color. |
| `Ball` | Nodo padre transformado por las pistas de movimiento del balón. |

Cada uno de los clips `Recovery`, `Dribble`, `Crossover`, `Standing`, `Rise`, `Pickup` y `Shot` requiere una pista de morph weights del personaje y pistas de translation, rotation y scale dirigidas a `Ball`. El endpoint de morph weights debe corresponder al número de morph targets de la malla animada. La duración de cada clip se obtiene de sus pistas de animación y debe corresponder a `motionData[clip].duration`.

En la exportación inspeccionada, `Ball` contiene `Ball_Surface`; la malla se llama `Dirto_Continuous`, tiene 112 morph targets y cada clip tiene cuatro canales (weights, translation, rotation y scale). Esos nombres de malla, cantidad de morph targets y conteo de canales describen esta entrega; el consumidor debe validar las capacidades y pistas requeridas, no fijar esos conteos como formato universal.

## Metadata de movimiento, formato 1

Cada entrada de `motionData` tiene:

- `duration`: número finito mayor que cero, en segundos.
- `gates`: lista de tiempos en segundos para puntos de salida compatibles. Debe ser una lista de números finitos ordenados de menor a mayor, sin duplicados, dentro de `[0, duration)`. El cero es válido y aparece en los siete clips reales. Una lista vacía también es válida: indica que no hay puntos de salida preferidos; el reproductor puede atender la solicitud al terminar el ciclo.
- `motion`: al menos dos frames ordenados por `time`, con el primer tiempo exactamente cero y el último igual a `duration` con tolerancia numérica pequeña.

Cada frame contiene `position`, `scale` y `rotation`, vectores de tres números finitos expresados en coordenadas de Blender, más `standing`, un peso finito normalizado de `0` a `1`. `shot` es opcional; si está presente, también es un peso finito normalizado de `0` a `1`. La ausencia de `shot` equivale a cero.

Los escalares `standing` y `shot` son señales para interpolar encuadre/pose: `standing` representa el avance entre sentado y de pie; `shot` representa el peso de la cámara de tiro. Los vectores guardan la transformación del balón. La rotación del balón usa el componente Z de Blender para el giro acumulado. Las conversiones a mundo glTF/Y-up se hacen en el consumidor, no al editar estos datos.

No se requiere un paso temporal fijo entre frames; la duración y los extremos deben concordar, y el tiempo debe crecer estrictamente.

## Gates y reproducción

`MotionPlayback` usa gates para elegir una salida compatible cuando hay una nueva solicitud durante un ciclo. Los gates están expresados en segundos locales del clip. En la exportación actual, todos los clips tienen gate `0`; `Standing` además tiene gates en `0.5` y `2.0833333333333335` segundos. La lista vacía conserva el cierre natural del ciclo como punto de salida.

Pickup y Rise son clips conectores y participan en las transiciones aunque su `standing` no permanezca constante. Shot es de ejecución única y la máquina lo devuelve a Standing. Estos comportamientos pertenecen a la lógica de reproducción, no se deducen solo de los valores de gates.

## Datos informativos de esta exportación

- Distribución web F6-04: 9.414.840 bytes; SHA-256 `a65517b2c8108d5a7fcbbe7ff6735070323de05d2f4035d9670dd3341084b1dc`.
- Entrada fuente local ignorada: 15.449.252 bytes; hash histórico `6505a219d8834c80997a1a78222ed57dc99e921efcbcde434396e6a1753163bc`.
- Las tres texturas PNG del balón en la distribución web miden 1024×512; las cinco texturas WebP del entorno mantienen sus dimensiones originales.
- Generador: glTF-Transform v4.5.1.
- Duraciones en segundos: Recovery 8; Dribble 2.375; Crossover 3.1666667; Standing 4.4166667; Rise 2.5; Pickup 3.5; Shot 10.5.
- El archivo integra imágenes y geometría; sus URIs de imagen no dependen de archivos externos.

El tamaño, hash, generador, paso temporal observado (~1/24 s), nombres de la malla y cantidad actual de morph targets sirven para trazabilidad y comparación de exportaciones. No son por sí solos reglas de compatibilidad.
