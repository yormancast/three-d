# Entradas y archivo local de modelos

Esta carpeta no se sirve con la web. Su contenido está ignorado por Git salvo este README. No es una copia de seguridad remota: conservar aparte los originales de Blender y los archivos locales que se necesiten compartir.

| Ruta                                   | Uso                                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `dirto-continuous.glb`                 | Entrada local de la escena integrada actual; ya está comprimida y tiene las animaciones listas |
| `el_dirto_v10.glb`, `el_dirto_v11.glb` | Exportaciones históricas del personaje                                                         |
| `archive/public-models/`               | Distribuciones históricas retiradas de `public/models/` el 20 de octubre de 2026               |

La app usa `public/models/continuous/dirto-continuous.glb`. Al organizar los archivos, esa distribución y la entrada local eran idénticas. En cambio, los v10/v11 de esta carpeta y sus antiguas versiones públicas tienen hashes y tamaños distintos: se conservan ambos, pues son exportaciones diferentes.

## Preparación de una nueva distribución

Inspeccionar primero el archivo y sus extensiones. No aplicar otra optimización por defecto al GLB integrado: ya usa Meshopt, cuantización y texturas incrustadas. Comparar clips, metadata, materiales y aspecto antes de reemplazar la distribución.

Para exportaciones que sí requieran optimización se conservan los comandos:

```bash
npm run model:inspect -- models/<nombre>.glb
npm run model:optimize -- models/<nombre>.glb public/models/<nombre>.glb
```

El optimizador tiene desactivados `palette` y `simplify` para preservar materiales y geometría. No asumir que todos los modelos usan los materiales `MAT_*` o un esqueleto: continuous usa color por vértice y deformaciones ya exportadas.

Consultar `public/models/README.md` para recursos activos y licencias, y `docs/assets/organization-manifest.json` para recuperar las rutas históricas.
