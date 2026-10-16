# Modelos fuente

Aquí van las exportaciones sin optimizar (GLB desde Blender). La carpeta está en `.gitignore`: solo se versiona el resultado optimizado en `public/models/`.

```bash
npm run model:optimize -- models/<nombre>.glb public/models/<nombre>.glb
npm run model:inspect -- public/models/<nombre>.glb
```

`model:optimize` aplica compresión Meshopt a la geometría y convierte las texturas a WebP con un máximo de 2048 px. El modelo resultante requiere `EXT_meshopt_compression` y `EXT_texture_webp`, así que el loader de la escena tiene que registrar `MeshoptDecoder`.
