# Reporte del portafolio 3D

> Documento histórico: diagnóstico de la v2 (`version-2`). La instalación sí funciona regenerando el lockfile; el original apuntaba al registro `registry.npm.taobao.org`, que ya no existe.

Fecha: 15 de octubre de 2026.

## Alcance

Revisión del código y la configuración del repositorio, con intentos de instalación, compilación y arranque local. La instalación no se completó, por lo que no se pudo inspeccionar la aplicación funcionando en un navegador. Los hallazgos de interfaz corresponden a lectura del código.

## Descripción de la aplicación

El proyecto es un portafolio de una sola página construido con Vue 3, TypeScript y Three.js. La pantalla combina un modelo GLB a pantalla completa con el nombre y cargo, navegación por secciones y paneles de contenido.

La navegación contiene las secciones Case Study, Experience y Contact. Cada sección está asociada a una animación del modelo: walk, stand e idle, respectivamente.

La configuración de contenido y del modelo está centralizada en `src/content/portfolio.ts`. La creación de la escena está dividida entre cámara, luces, materiales, controles y animaciones dentro de `src/libs/three/`.

## Estado del repositorio

- Rama actual: `version-2`.
- Un commit local por delante de `origin/version-2`: `087fc0f`, «new structure, new model and new design».
- Hay cambios locales sin commit en el componente 3D, la vista principal, el contenido, las definiciones y la escena.
- También hay archivos nuevos relacionados con animaciones y una imagen en `public/`.

Los cambios locales preexistentes se conservaron durante la revisión.

## Stack y herramientas

| Elemento | Versión declarada |
| --- | --- |
| Vue | `^3.0.0` |
| Vue CLI | `~4.5.0` |
| Three.js | `0.131.1` |
| TypeScript | `~4.9.5` |
| ESLint | `^6.7.2` |
| Sass | `^1.98.0` |

La base combina herramientas antiguas con algunas dependencias actualizadas posteriormente. Los comandos de desarrollo y build usan `--openssl-legacy-provider`, una señal de compatibilidad heredada del toolchain.

## Instalación y ejecución

No había `node_modules` al comenzar la revisión.

Se intentó instalar con `npm ci`, pero la instalación no terminó y dejó un árbol parcial sin el ejecutable de Vue CLI. Se observó una advertencia de compatibilidad de `@achrinza/node-ipc@9.2.2`: no declara soporte para Node 20, que era la versión disponible (`20.20.2`). Esta advertencia no demuestra por sí sola la causa del bloqueo.

El intento offline terminó con `ENOTCACHED`: el lockfile solicita `yorkie-2.0.0.tgz` desde `registry.npm.taobao.org` y el paquete no estaba en caché.

Tanto `npm run serve` como `npm run build` fallaron con:

```text
sh: vue-cli-service: command not found
```

La app no quedó levantada y la compilación no pudo verificarse. El primer paso pendiente es resolver la instalación y revisar las URLs heredadas del lockfile.

## Hallazgos técnicos

### 1. La escena no libera sus recursos al desmontarse

En `src/components/threeD/model3D/model3d.vue` se elimina el listener de resize, pero el controlador de escena no ofrece un método de destrucción.

En `src/libs/three/createPortfolioScene.ts`, el bucle de `requestAnimationFrame` continúa y no se liberan controles, renderer, geometrías, materiales ni texturas. Un nuevo montaje puede acumular renderizado y recursos WebGL.

**Acción propuesta:** incorporar `dispose()` al controlador, cancelar el frame pendiente y liberar los recursos desde `onBeforeUnmount`.

### 2. La carga del modelo carece de estados visibles

El loader registra los errores en consola, pero la interfaz no muestra progreso, error o una alternativa visual. Tampoco se controla explícitamente un fallo al crear el renderer WebGL.

**Acción propuesta:** definir estados de carga, listo y error, con una imagen alternativa que permita mantener accesible el contenido del portafolio.

### 3. Las solicitudes de animación pueden perderse durante la carga

La navegación llama a `playAnimation`, pero mientras el GLB no termina de cargar no existe el mixer y la llamada se descarta. Si el usuario selecciona una sección durante ese intervalo, el modelo comienza con idle y puede quedar desincronizado de la sección activa.

**Acción propuesta:** conservar la animación solicitada y aplicarla cuando termine la carga. Validar también los nombres de clips del nuevo modelo.

### 4. El modelo actual requiere revisar peso y proporciones

- `public/gltf/after_work-2.glb`: aproximadamente 4,9 MiB.
- `public/gltf/bunny.glb`: aproximadamente 1,9 MiB.
- Escala configurada para el modelo activo: `{ x: 1.8, y: 0.7, z: 0.5 }`.

La escala no uniforme modifica las proporciones originales. Debe confirmarse si es intencional antes de integrar el nuevo modelo. El README conserva la compresión Draco como tarea pendiente.

**Acción propuesta:** acordar un presupuesto de descarga, revisar geometría y texturas, y definir escala, origen y encuadre del nuevo activo.

### 5. El renderizado está acoplado al tamaño de la ventana

El renderer y la cámara usan `window.innerWidth` y `window.innerHeight`. Esto funciona para una escena a pantalla completa, pero dificulta reutilizarla dentro de un contenedor de otro tamaño.

El renderizado es continuo y el pixel ratio llega a 2,5; conviene medir su coste en móviles con el modelo definitivo.

**Acción propuesta:** medir el contenedor y definir una estrategia de calidad adaptada al dispositivo, junto con pausas cuando la página no sea visible.

### 6. El tipado deja contratos importantes sin comprobar

El componente usa `any` para el controlador y varios módulos de Three.js también recurren a `any`. `PortfolioSection.animationName` es un `string`, aunque el mixer define una unión de nombres admitidos.

**Acción propuesta:** compartir los tipos de controlador y animación para detectar nombres inválidos durante la compilación.

## Interfaz, contenido y accesibilidad

- El documento declara `lang=""`; debe indicar el idioma del contenido.
- No hay descripción SEO ni metadatos sociales en `public/index.html`.
- El CSS fija el sitio a la ventana y bloquea el scroll. El rediseño debe contemplar contenido largo, pantallas pequeñas y aumento del tamaño del texto.
- La ventana usa `v-html` para textos que actualmente no necesitan HTML. Puede sustituirse por interpolación mientras no exista una necesidad editorial concreta.
- `socials.vue` y sus enlaces están definidos, pero no se montan en la vista principal actual. Contact menciona GitHub y LinkedIn sin incluir enlaces en su propio texto.
- El estado activo de los botones se representa visualmente mediante una clase; conviene añadir una indicación accesible, como `aria-pressed`.
- No se observa una adaptación a `prefers-reduced-motion`.
- Los textos actuales son breves y generales. Para el rediseño faltan casos de estudio concretos, resultados, experiencia detallada y una vía de contacto visible.

## Plan propuesto para la actualización

1. **Recuperar una ejecución reproducible.** Resolver la instalación, revisar el lockfile y definir la versión de Node soportada. Confirmar arranque y build antes de migrar herramientas.
2. **Estabilizar la escena.** Añadir liberación de recursos, estados de carga/error y sincronización de animaciones tras cargar el GLB.
3. **Preparar el nuevo modelo.** Confirmar clips, rig, origen, proporciones, materiales y peso. Definir cámara y luces con el activo definitivo.
4. **Modernizar el toolchain.** Evaluar la migración de Vue CLI a Vite y actualizar Vue, TypeScript y Three.js de forma controlada. La actualización de Three.js requiere revisar APIs de color y renderizado.
5. **Implementar el rediseño.** Definir estructura de contenido, comportamiento móvil, navegación, contacto, accesibilidad y tratamiento del movimiento.
6. **Validar la experiencia completa.** Revisar carga del modelo, cambios de sección, errores de descarga, WebGL no disponible, rendimiento móvil y despliegue.

## Resultado de la revisión

El código ya tiene una separación útil entre contenido, componentes y configuración de la escena para avanzar con el nuevo modelo y diseño. Los pendientes inmediatos son recuperar la instalación y corregir la gestión de recursos y carga 3D. La apariencia y el comportamiento real en navegador siguen pendientes de verificación.
