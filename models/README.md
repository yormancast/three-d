# Modelos fuente

Aquí van las exportaciones sin optimizar (GLB desde Blender). La carpeta está en `.gitignore`: solo se versiona el resultado optimizado en `public/models/`.

```bash
npm run model:optimize -- models/<nombre>.glb public/models/<nombre>.glb
npm run model:inspect -- public/models/<nombre>.glb
```

`model:optimize` aplica compresión Meshopt a la geometría y convierte las texturas a WebP con un máximo de 2048 px. El modelo resultante requiere `EXT_meshopt_compression` y `KHR_mesh_quantization` (y `EXT_texture_webp` si tiene texturas), así que el loader de la escena tiene que registrar `MeshoptDecoder`.

Dos pasos de `optimize` están desactivados a propósito:

- `--palette false`: la paleta fusiona todos los materiales en uno con una textura de colores. Se pierden los nombres `MAT_*`, que la escena necesita para aplicar los colores que le llegan por configuración (R7).
- `--simplify false`: en `el_dirto_v10` solo quitaba un 2,5 % de triángulos (7 KB) y simplificar una malla con skinning puede romper las deformaciones.
