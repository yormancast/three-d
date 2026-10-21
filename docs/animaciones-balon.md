# Animaciones con balón: Dribble y Crossover

El Dirto sentado en la banca, dribleando con el balón. Las dos animaciones están en `public/models/el_dirto_v11.glb` (commit `138b368`), junto a los clips originales `Idle`, `Listen` y `Walk`.

## Resumen

| Clip | Duración | Fotogramas | Manos | Qué hace |
| --- | --- | --- | --- | --- |
| `Dribble` | 2,375 s | 57 + cierre, 24 fps | Derecha | Cinco botes distintos al lado del muslo derecho, mirando al frente |
| `Crossover` | 3,167 s | 76 + cierre, 24 fps | Las dos | Dribla con la derecha, cruza el balón por delante de los pies, dribla con la izquierda y vuelve |

Los dos son loops: el último fotograma repite el primero.

## Dribble

Dribleo sentado con la mano derecha. La mirada va al frente: el cuello y la cabeza compensan la inclinación del tronco para que la cara quede nivelada mientras la mano trabaja sola.

**Secuencia de botes** (alturas del centro del balón en el punto de contacto, con el personaje a 2 m de alto):

| # | Tipo | Fotogramas | Altura |
| --- | --- | --- | --- |
| 1 | Normal | 12 | 0,45 m |
| 2 | Bajo y rápido | 9 | 0,40 m |
| 3 | Bajo y rápido | 8 | 0,37 m |
| 4 | Transición | 15 | 0,41 m |
| 5 | Alto y lento | 13 | 0,53 m |

**Movimiento:**

- **Balón:** baja empujado y acelerando, toca el suelo al 42 % de cada bote y sube frenando hasta la mano. En el fotograma del suelo se achata un 14 %. Cada bote cae en un punto algo distinto y el balón gira una vuelta completa por loop.
- **Mano:** acompaña al balón al recibirlo y al empujarlo. Al soltarlo sigue un poco hacia abajo y vuelve a subir a esperarlo. Se inclina hacia atrás al recibir y hacia abajo al empujar.
- **Cuerpo:** el tronco se inclina hacia el balón y se inclina más cuando la mano va baja. En cada bote hay un pequeño empuje del tronco y del hombro. Los botes altos empujan más fuerte.
- **Mano izquierda:** apoyada cerca de la rodilla.

## Crossover

Dribleo sentado con cambio de manos. En el cruce, el balón bota en dirección a la mano contraria.

**Secuencia:**

| # | Tipo | Fotogramas |
| --- | --- | --- |
| 1 | Derecha, normal | 12 |
| 2 | Derecha, bajo | 11 |
| 3 | Cruce derecha → izquierda | 15 |
| 4 | Izquierda, normal | 12 |
| 5 | Izquierda, bajo | 11 |
| 6 | Cruce izquierda → derecha | 15 |

**Movimiento:**

- **Cruce:** la mano empuja el balón en diagonal. Bota en el centro, por delante de los pies, y sube hasta la otra mano. Primero sale hacia delante y luego cruza; al subir hace lo contrario. Así no pasa por las rodillas.
- **Las dos manos:** la que suelta vuelve a apoyarse cerca de la rodilla. La que recibe baja a esperar el balón antes de que llegue.
- **Cuerpo:** el tronco pasa de inclinarse a la derecha a inclinarse a la izquierda y queda recto durante el cruce. La cabeza sigue al frente en los dos lados.
- **Botes laterales:** son los mismos de `Dribble`, en espejo para la izquierda.
- **Choques:** se midieron contra la malla en cada fotograma. El balón nunca atraviesa las piernas: en el punto más justo pasa a 3,4 cm.

## Datos técnicos

- **Esqueleto:** los 21 huesos del modelo, con traslación, rotación y escala en cada fotograma. Los clips incluyen la pose sentada completa.
- **Balón:** nodo `Ball` en la raíz de la escena, al mismo nivel que `El_Dirto_Web` y `root`. Su posición, rotación y escala van dentro del mismo clip, así que nunca se desincroniza de la mano. Material `MAT_ball`. Su color tiene que llegar por configuración, como los demás `MAT_*` (R7).
- **Origen:** queda en el suelo. Los clips bajan la pelvis hasta la altura de la banca y el balón bota a altura 0.
- **Banca:** en unidades del GLB, con Y hacia arriba, el centro del asiento está en (1,48; 1,56; −0,13) y la cara superior a 1,65 de altura. Con el personaje escalado a 2 m de alto, es una banca de 0,5 m.
- **En la app:**
  - Hay que ocultar `Ball` en `Idle`, `Listen` y `Walk`, porque esos clips no lo mueven.
  - En el render de Blender el desenfoque de movimiento disimulaba que, en un par de fotogramas de recepción, la mano queda hasta unos 2 cm por encima del balón. En el navegador no hay ese desenfoque.

## Límites

- La mano es un solo hueso, sin dedos ni giro de muñeca, así que se ve como una manopla que empuja el balón. Para que lo envuelva haría falta añadir huesos de dedos al modelo.
- La sudadera no tiene huesos propios y no reacciona al movimiento.
