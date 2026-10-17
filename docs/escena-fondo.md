# Propuesta: escena de fondo

Fecha: 17 de octubre de 2026. Desarrolla la escena aprobada en [direccion-de-arte.md](direccion-de-arte.md) (**Bajo el puente · Calle · Noche**): qué contiene, cómo se ilumina, cómo se produce y cómo encaja en la app.

| Techo de calidad (Blender, Cycles) | Estado actual en el navegador |
| --- | --- |
| ![Blender](direccion-de-arte/blender-noche.jpg) | ![Web](direccion-de-arte/web-noche-escritorio.jpg) |

El objetivo es que el navegador se acerque a la imagen de la izquierda. La de la derecha es la maqueta con texturas generadas en código.

## Principios

1. **El personaje manda.** El fondo tiene menos contraste y saturación que El Dirto. La niebla, la profundidad de campo y la luz cálida sobre la banca separan al personaje del entorno.
2. **El fondo no se mueve.** Solo se mueven el personaje, la cámara y unos pocos detalles vivos. Por eso la luz del entorno se puede hornear y el realismo sale casi gratis en tiempo de ejecución.
3. **Una sola pantalla.** La escena está compuesta para el encuadre de la cámara, no para recorrerla. Lo que la cámara nunca ve no se modela.
4. **Funciona en móvil.** Con la luz horneada quedan 1 o 2 luces dinámicas y ninguna sombra en tiempo real del entorno.

## Composición

Tres planos de profundidad vistos desde la cancha, con la cámara a la altura de los ojos de alguien sentado:

| Plano | Distancia | Contenido | Función |
| --- | --- | --- | --- |
| **Primer plano** | 0–6 m | Banca lima, El Dirto sentado, balón, bolso, suelo de la cancha mojado con líneas hueso y charcos | Escenario del personaje; aquí va la luz cálida |
| **Plano medio** | 6–18 m | Resto de la cancha morada, aro y tablero, pilares de la autopista con franjas lima/morado y afiches, muro de contención de 2,2 m con el mural "DIRTO" | Enmarca y da identidad |
| **Fondo** | 18–80 m | Calle comercial detrás del muro: vereda con baranda, calzada con cebra, autos, locales con letreros, semáforo, faroles, edificios con ventanas encendidas | Vida y profundidad; queda en niebla y desenfoque |
| **Techo** | — | Tablero de hormigón de la autopista con borde lima encendido | Cierra el encuadre por arriba y oculta el cielo, que no hace falta modelar |

La cancha está hundida respecto a la calle: la calzada se ve a la altura del remate del muro. Así se ve la calle sin que tape al personaje.

## Inventario

| Elemento | Detalle | Material | Prioridad |
| --- | --- | --- | --- |
| Suelo de la cancha | Morado con líneas hueso repintadas, grietas, juntas, charcos | Pintura sobre asfalto, rugosidad variable (mojado/seco) | Imprescindible |
| Banca | Metal pintado lima, desconchada | Metal pintado | Imprescindible |
| Balón y bolso | Junto a la banca | Goma, tela | Imprescindible |
| Tablero de la autopista | Vigas, juntas, escurridos, óxido, borde lima | Hormigón | Imprescindible |
| Pilares (3–4) | Franjas lima/morado, afiches pegados, grafiti | Hormigón pintado + calcomanías | Imprescindible |
| Muro de contención | Mural "DIRTO" en morado, lima y hueso, desconchado | Hormigón + pintura | Imprescindible |
| Aro y tablero de básquet | Red rota | Metal, malla | Imprescindible |
| Calle | Vereda, baranda, calzada con cebra y bordes lima | Asfalto, hormigón, metal | Imprescindible |
| Autos (2 aparcados) | Uno morado, uno lima; formas simples | Pintura metalizada | Recomendado |
| Locales | 3–4 fachadas con letreros (uno de neón lima) | Vidrio emisivo, chapa | Recomendado |
| Edificios | Volúmenes con ventanas encendidas al azar | Textura emisiva | Recomendado |
| Mobiliario | Semáforo, faroles, basurero, quiosco | Metal | Recomendado |
| Basura | Papeles, latas, hojas, chicles | Calcomanías y quads | Detalle |

## Iluminación

De noche y fría, con dos acentos: el lima de la identidad y el cálido sobre el personaje.

| Luz | Tipo | Color | En navegador |
| --- | --- | --- | --- |
| Focos bajo el tablero | Área / spot | Blanco frío (~5500 K) | Horneada |
| Farol sobre la banca | Spot | Cálido (~3000 K) | **Dinámica**, ilumina al personaje y proyecta su sombra |
| Borde lima del tablero | Emisivo | `--color-lime` | Emisivo + bloom |
| Faroles de calle | Puntual | Sodio / cálido | Horneada |
| Neón de local | Emisivo | Lima | Emisivo + bloom, parpadeo |
| Ventanas de edificios | Emisivo | Cálido / frío al azar | Textura emisiva |
| Luna / cielo | Ambiente | Azul oscuro | Horneada + HDRI para reflejos |
| Faros de auto que pasa | Spot | Blanco | **Dinámica** (opcional) |

**Atmósfera:** niebla exponencial suave hacia el fondo y conos de luz falsos (geometría aditiva) bajo los focos, con algo de polvo.

## Detalles vivos

Movimiento mínimo para que la noche no se vea congelada. Ninguno compite con el personaje.

| Detalle | Coste | Prioridad |
| --- | --- | --- |
| Neón de un local que parpadea | Muy bajo | Primera versión |
| Pulso suave en el borde lima del tablero | Muy bajo | Primera versión |
| Auto que pasa con faros, cada 15–30 s | Bajo | Primera versión |
| Polvo flotando en los conos de luz | Bajo | Segunda versión |
| Ondas en un charco | Bajo | Segunda versión |
| Lluvia fina o vapor de una alcantarilla | Medio | Opcional |

## Cámara por sección

La escena tiene que funcionar desde cinco puntos de vista. Cada sección acerca la cámara a una zona del personaje (donde se ancla la tarjeta) y cambia qué parte del fondo queda detrás.

| Estado | Encuadre | Fondo detrás | Animación del modelo |
| --- | --- | --- | --- |
| Inicio | Plano general, personaje centrado en la banca | Muro, calle y pilares | `Sit` (reposo) |
| Bio | Medio, enfoca la cara | Mural "DIRTO" desenfocado | Por definir |
| Projects | Medio, enfoca las manos | Pilar con afiches | Por definir |
| Experience | Medio-bajo, desde un lado | Calle y autos | Por definir |
| Contact | Plano corto, ligero contrapicado | Borde lima del tablero | Por definir |

Los encuadres son una propuesta; se ajustan cuando exista la escena en Blender. La profundidad de campo cambia con cada sección para que el fondo quede siempre detrás del personaje en nitidez.

## Producción

```
Blender (modelado + materiales + luz) ──► hornear luz a lightmaps
        │                                         │
        ▼                                         ▼
  exportar entorno.glb ──► npm run model:optimize (meshopt + webp/KTX2)
                                                  │
                                                  ▼
                     public/models/entorno.glb + entorno-lite.glb
```

1. **Bloqueo.** Volúmenes grises con la cámara de cada sección, para validar la composición antes de detallar.
2. **Modelado y materiales.** Texturas PBR reales (asfalto, hormigón, metal pintado, ladrillo) de bibliotecas libres como Poly Haven o ambientCG, con calcomanías para el desgaste y los grafitis. Antes de descargar nada se pide permiso.
3. **Horneado.** Una textura de luz por grupo de objetos (suelo, autopista y pilares, muro, calle), con sombras suaves, rebotes y halos de los faroles. El script del render de muestra sirve de base.
4. **Exportación.** Un GLB para el entorno, aparte del personaje. Los emisivos (neón, borde lima, ventanas) van como materiales separados para animarlos y teñirlos desde la configuración.
5. **Optimización.** `npm run model:optimize`; se mide con `npm run model:inspect`.
6. **Versión ligera.** Mismo entorno con texturas a 512 px y sin calcomanías. Carga primero y se sustituye en segundo plano.

## Presupuesto

| Métrica | Objetivo |
| --- | --- |
| Peso total del entorno | 8–15 MB (completo), ≤ 2 MB (ligero) |
| Triángulos del entorno | ≤ 150 k |
| Draw calls | ≤ 60 |
| Texturas | ≤ 2048 px, KTX2 o WebP |
| Luces dinámicas | 2 como máximo (farol de la banca + faros) |
| Sombras en tiempo real | Solo las del personaje |
| Rendimiento | 60 fps en un portátil medio, ≥ 30 fps en un móvil medio |
| Postproceso | Bloom suave, profundidad de campo, viñeta, grano. Se apaga por partes si bajan los fps |

## Encaje en la arquitectura

- **`src/scene/`** carga el entorno, aplica los lightmaps, crea las luces dinámicas, los detalles vivos y el postproceso. No conoce Vue ni el contenido (R1), y no escribe colores (R7).
- **`src/content/`** define, por sección, la posición de cámara, el objetivo, la profundidad de campo y la animación (R4). También el color de los emisivos y de las luces, leído de los tokens.
- **`src/composables/`** traduce la sección activa en llamadas a la escena y pasa los colores de `tokens.css` a la configuración (R3).
- **Estados:** cargando (fondo `--color-night` y versión ligera), listo y error (imagen estática del render como alternativa).

## Pendiente

- Animación `Sit` y una animación por sección en el GLB del personaje. Hoy las maquetas usan una pose hecha a mano.
- Decidir los encuadres definitivos con el bloqueo en Blender.
- Permiso para descargar texturas PBR y un HDRI de noche.
- Licencias: usar solo recursos CC0 y anotarlos en `models/README.md`.
- Fallback sin WebGL: la imagen del render con las tarjetas encima.

## Fases

| Fase | Entrega | Criterio de hecho |
| --- | --- | --- |
| 1. Bloqueo | Escena gris en Blender + render desde las 5 cámaras | Composición aprobada |
| 2. Entorno horneado | `entorno.glb` con lightmaps, cargado en la app | Se ve como el render de muestra y cumple el presupuesto |
| 3. Luz dinámica y postproceso | Farol de la banca, bloom, DoF, niebla | El personaje destaca en los 5 encuadres |
| 4. Detalles vivos | Neón, pulso lima, auto que pasa | 60 fps en escritorio |
| 5. Móvil y carga | Versión ligera, estados de carga y error | ≥ 30 fps en móvil, primera imagen en < 2 s |
