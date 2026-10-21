# Assets publicados

La aplicación carga exclusivamente:

| Archivo | Función |
| --- | --- |
| `continuous/dirto-continuous.glb` | Escena integrada: personaje, entorno, balón, emisivos, siete clips y metadata de movimiento |
| `continuous/preview.jpg` | Imagen de respaldo durante la carga o si falla WebGL |

El GLB contiene sus imágenes y movimientos; no necesita `motions.json` ni los GLB de fases anteriores. Se carga con MeshoptDecoder. No volver a añadir los modelos históricos a `public/`: Vite copia todo su contenido al build aunque el código no lo importe.

La entrada local está en `models/dirto-continuous.glb`. Al organizar los assets el 20 de octubre de 2026 era idéntica a la distribución. Es una separación intencional entre entrada y publicación, no una segunda descarga del sitio.

## Procedencia y licencias

El personaje, su paleta y la composición pertenecen al proyecto El Dirto. El entorno incorpora estos recursos CC0 de Poly Haven, autorizados el 18 de octubre de 2026:

| Recurso | Autoría registrada | Uso |
| --- | --- | --- |
| [Asphalt 02](https://polyhaven.com/a/asphalt_02) | Rob Tuytel | Cancha y calle |
| [Concrete Wall 006](https://polyhaven.com/a/concrete_wall_006) | Charlotte Baglioni, Dario Barresi | Puente, pilares y muro |
| [Rooftop Night](https://polyhaven.com/a/rooftop_night) | Poly Haven; ver ficha original | Iluminación ambiental |

Licencia: [CC0 1.0 de Poly Haven](https://polyhaven.com/license). Los mapas originales se descargaron a un máximo de 2K; la distribución incorpora atlas derivados. El registro original de descargas y sus hashes está en `docs/assets/polyhaven-manifest.json`; no enumera las imágenes finales del GLB.

El cuero del balón procede de [Basketballs](https://opengameart.org/content/basketballs), por DigitalN8m4r3 (Miodrag Sejic), publicado bajo CC0 según la entrega documentada en `docs/exportacion-web-glb-unico.md`. Se conservan color, normal y rugosidad del balón integrado.

## Histórico

Las entregas `environment`, `phase3`, `recovery`, `ball-animations`, el JSON de movimiento externo y los modelos públicos v10/v11 se trasladaron a `models/archive/public-models/`, fuera del build e ignorados por Git. No se borraron los binarios. Sus rutas originales aparecen en documentos históricos y no son dependencias de la aplicación actual.

El detalle de movimientos, tamaños y hashes queda en `docs/assets/organization-manifest.json`. Para recuperar una entrega local, copiarla desde su destino archivado; no restaurar todas las fases dentro de `public/`.
