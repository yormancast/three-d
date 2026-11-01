# Plan consolidado del portafolio v3

Actualizado el 1 de noviembre de 2026. Este archivo sustituye los planes por fase y resume arquitectura, decisiones, resultados y trabajo pendiente. Los documentos originales y sus evidencias permanecen en el historial de Git; no se conserva una copia comprimida.

## Estado actual

| Fase                        | Estado                                           | Resultado o pendiente                                             |
| --------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| 0. Dirección y arquitectura | Definida e implementada como base                | SPA Vue con escena persistente y tarjetas HTML                    |
| 1. Assets                   | Completada para el alcance actual                | GLB integrado, póster y distribución optimizada                   |
| 2. Base técnica             | Completada                                       | Contrato validado, recursos liberables, visor solo de desarrollo  |
| 3. Secciones y coordinación | Completada                                       | Intención de presentación, navegación por hash y recuperación     |
| 4. Home y Bio               | Completada                                       | Contenido aprobado, foco, tarjetas y encuadres integrados         |
| 5. Portafolio completo      | Completada; contenido aprobado el 1 de noviembre | Projects, Experience y Contact definitivos para el alcance actual |
| 6. Móvil y rendimiento      | Parcial                                          | Faltan dispositivo físico, métricas y cierre de rendimiento       |
| 7. Entrega                  | Parcial                                          | Faltan revisión final y validaciones del entorno de publicación   |

No hay un porcentaje global. Implementación, pruebas automáticas, revisión visual y aprobación artística son verificaciones distintas.

## Decisiones vigentes

- Sitio público en inglés: Home, Bio, Projects, Experience y Contact. Una tarjeta abierta a la vez; cerrar devuelve a Home. Las etiquetas de navegación llevan punto inicial.
- Bio se conserva sin cambios por decisión del usuario.
- Projects destaca Vans Customizer y este portafolio. Vans incluye un enlace público con texto Link e icono externo.
- Experience incluye formación universitaria en diseño gráfico, inclinación por frontend y flexibilidad para backend, full-stack o arquitectura; tres etapas profesionales basadas en el CV del usuario.
- LinkedIn es la mejor vía de contacto. No se necesita un formulario para cerrar el alcance.
- El texto del portafolio acredita las bases manuales del usuario, actualización con Claude Code, concepto y bocetos con ChatGPT, dirección visual y cancha ideadas por el usuario con Opus 5.5, personaje/entorno/texturas/rigging/animaciones de básquet con Astra y orquestación multiagente con Sol.
- Identidad G2 aprobada integrada en el sitio y favicons. Las exploraciones del logo se guardaron fuera del repo en `~/.codex/memories/projects/three-d/identidad/`.
- Shot sigue disponible en el visor de desarrollo; exponerlo en la interfaz pública no forma parte del alcance acordado.
- Contenido aprobado no equivale a una nueva validación visual con todos los textos finales.

## Arquitectura y dirección visual

- Vue 3 y Three.js, una escena persistente, un personaje y una sola carga del GLB. La navegación no remonta el visor.
- `content/` contiene datos y presets; `usePortfolio` controla sección y hash; `useEnvironment` controla el ciclo de vida; `scene/` maneja carga, reproducción, cámara y render; Vue dibuja la interfaz y el conector.
- Conservar las reglas de capas, tipos y estilos de [RULES.md](../RULES.md). No duplicar la máquina de reproducción ni controlar la escena desde componentes.
- Dirección visual: cancha nocturna bajo un puente, paleta lima/morado/hueso, Archivo y JetBrains Mono. Los colores de interfaz y luces configurables viven en `src/styles/tokens.css`; las texturas mantienen su paleta artística.
- Tarjeta lateral y conector semántico en escritorio; tarjeta inferior sin conector en layout compacto. Scroll interno para textos largos y áreas seguras.
- Movimiento reducido: cámara inmediata y pose estable. Navegación y contenido funcionan durante carga/error y sin depender de WebGL. Pausar no bloquea la cámara.
- Asociación actual: Home/Recovery, Bio/Dribble, Projects/Crossover, Experience/Standing y Contact/Recovery.
- `MotionPlayback` conserva gates compatibles, conectores Pickup/Rise y última solicitud. `continuousMotion` es el único escritor de deformaciones y transformación del balón durante la reproducción.

## Recursos y contrato esencial

- Distribución activa: `public/models/continuous/dirto-continuous.glb` y `preview.jpg`. Entrada fuente local ignorada: `models/dirto-continuous.glb`.
- GLB público: 9.414.840 bytes; SHA-256 `a65517b2c8108d5a7fcbbe7ff6735070323de05d2f4035d9670dd3341084b1dc`. Fuente original: 15.449.252 bytes. Las tres texturas del balón se redujeron a 1024×512; fuente y distribución difieren intencionalmente.
- glTF 2.0, MeshoptDecoder y texturas incrustadas; sin dependencias externas de imagen o buffer.
- `scenes[scene].extras.formatVersion: 1` y `extras.motionData` son propiedades hermanas. Rechazar versiones de movimiento ausentes o incompatibles.
- Grupos requeridos: `ElDirto_Character`, `ElDirto_Environment`, `ElDirto_Emissives` y nodo `Ball`. Personaje animado por morph targets; no buscar huesos en el GLB para anclar tarjetas.
- Clips: Recovery, Dribble, Crossover, Standing, Rise, Pickup y Shot. Requieren pesos del personaje y transformación del balón, con duraciones coherentes con el metadata.
- Metadata: duración positiva finita; gates finitos, ordenados y únicos dentro de `[0, duration)`; al menos dos frames con tiempos estrictamente crecientes desde cero hasta duración. Position/scale/rotation son vectores finitos en coordenadas Blender; standing y shot son pesos entre 0 y 1, shot opcional equivale a cero. Convertir coordenadas en el consumidor.
- Conservar entorno horneado unlit, material del balón y color por vértice del personaje. No reoptimizar geometría o deformaciones sin comparar apariencia y coreografía.
- Licencias y procedencia siguen accesibles en [public/models/README.md](../public/models/README.md). No copiar modelos históricos a `public/`: Vite publica todo ese directorio.

## Fases 2–5: trabajo cerrado

- F2-01–F2-12: contrato real del GLB, validación de metadata/estructura, propiedad y liberación de recursos, materiales extraídos, viewport y estados, visor de desarrollo, inventario y entrega reproducible desde Git.
- F3-01–F3-07: catálogo tipado, comando de presentación, intención conservada al cargar/reintentar, selección, hash/historial e integración pública. Última selección prevalece durante transiciones y carga.
- F4-00–F4-05: identidad personal, Bio confirmada, integración de contenido, teclado/lectura, composición y validación Home → Bio → Home.
- F5-00–F5-07: contratos y tarjetas por sección, proyectos, experiencia, contacto, pausa/reanudación, recorrido y validación integrada. Cierre funcional el 22 de octubre; el usuario aceptó no exportar PNG en esa revisión.
- F5-08: Shot público opcional, no adoptado. No constituye un bloqueo de entrega.
- La revisión editorial que antes estaba aplazada se completó y aprobó el 1 de noviembre. Experience ya no está vacía; no restaurar el texto provisional anterior.

## Fase 6: resultados y tareas pendientes

Implementado: breakpoint compartido de 800 px, perfiles de calidad separados del layout/orientación, cámaras móviles, límite de DPR, DOF desactivado y bloom reducido en móvil, scroll y áreas seguras, indicador de carga indeterminado, motor en chunk dinámico y recuperación con canvas nuevo que conserva sección y pausa.

Validaciones previas: cinco vistas por diez tamaños emulados, 320 px, zoom real al 200 %, texto extenso temporal, movimiento reducido, pestaña oculta y pérdidas reales de contexto. Nueve recuperaciones en tres tandas mantuvieron un solo canvas. Heap JS tras GC: 203,38–204,34 MB; no demuestra ausencia de fugas ni estabilidad de memoria GPU.

La profundidad compartida evita un segundo dibujo de geometría para DOF, conserva MSAA 4 y efectos. En una comparación emparejada de Bio pasó de 32,9 a 43,4 FPS; la variante sin MSAA se rechazó por degradación visual. Mediciones posteriores de 30 s, a 1710×897 y DPR de render limitado a 1,25:

| Vista      | FPS rAF | p95 de intervalo, ms |
| ---------- | ------: | -------------------: |
| Home       |    49,7 |                 33,4 |
| Bio        |    44,8 |                 34,0 |
| Projects   |    44,8 |                 34,0 |
| Experience |    43,8 |                 34,2 |
| Contact    |    37,9 |                 34,2 |
| Navegación |    38,6 |                 34,3 |

Datos históricos del 25 de octubre; no son mediciones del contenido final ni de móvil físico. El principal coste observado fue el postproceso. Render directo alcanzó 60 FPS en la muestra diagnóstica; no se incorporó retirar los efectos.

| Tarea                                | Estado y siguiente paso                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| F6-00. Línea base y protocolo        | Registrada; repetir con dispositivo, viewport/DPR, navegador, alimentación, red y caché definidos                 |
| F6-01. Layout, calidad y orientación | Implementada y matriz emulada recorrida; faltan barras/áreas seguras y rotación en móvil físico                   |
| F6-02. Lectura y controles           | 320 px, scroll, texto extenso y zoom revisados; falta ampliación del sistema móvil y revisión con contenido final |
| F6-03. Carga y recuperación          | Recuperación real, pausa y última sección verificadas; falta arrancar con WebGL realmente deshabilitado           |
| F6-04. Texturas del balón            | Optimización adoptada; fuente preservada y distribución reducida a 9,41 MB                                        |
| F6-05. Cuello de botella             | Chunk dinámico y profundidad compartida adoptados; faltan primer frame GPU y resolver o aceptar desviación de FPS |
| F6-06. Composición final             | Falta revisar contenido final, encuadres/transiciones y Shot en visor; emulación no acredita aprobación artística |
| F6-07. Repetición y cierre           | Faltan portátil/móvil físico, caché caliente completa y memoria aislada/GPU                                       |

Criterios para medir y cerrar:

- Tres cargas frías y mediana, separadas de caché caliente. Medir póster, HTML utilizable y primer frame 3D presentado; ready y `submissionMs` no representan tiempo GPU.
- Muestras de 30 s por vista y navegación, con FPS/p95 y memoria JS/GPU distinguidas de estimaciones o conteos.
- La prueba local de caché caliente mantuvo transferencia completa del GLB aunque JS/CSS salieron de caché; configurar y medir hosting real.
- Metas de diseño: 60 FPS en portátil medio, al menos 30 FPS en móvil medio y primera imagen en menos de 2 s con red definida. No se consideran demostradas. Registrar desviaciones y obtener aceptación explícita si se cierra sin alcanzarlas.

## Fase 7: entrega

Ya realizado: idioma inglés, título/descripción, Open Graph y tarjeta social, correcciones responsive de carga/error, instalación aislada y build reproducible de la integración anterior. El motor mantiene aviso de Vite por chunk superior a 500 kB.

- [ ] Completar o aceptar explícitamente los pendientes de fase 6.
- [ ] Revisar contenido final en escritorio y móvil: tarjetas, enlaces, contraste, teclado/foco, carga, error y movimiento reducido.
- [ ] Confirmar inventario final y licencias de recursos.
- [ ] Ejecutar check y build del candidato final desde checkout limpio; registrar commit y resultados.
- [ ] Preparar entrega con límites reales y revisión visual final.
- [ ] Cuando se solicite publicar: configurar hosting/caché y comprobar URL pública e imagen de compartir en `yormancastellanos.com`.

Última comprobación automática previa a esta consolidación: 65 pruebas aprobadas en 13 archivos, junto a formato, lint y TypeScript. No sustituye las validaciones físicas ni acredita un nuevo build de producción.

## Recuperar documentos y evidencias anteriores

Punto de recuperación completo: `293a86cf680a75ade43897b3d3d70d1ff4a96561`. Incluye los planes originales, arquitectura, contratos, reportes, manifiestos y capturas retirados al consolidar. Puede consultarse en [GitHub](https://github.com/yormancast/three-d/tree/293a86cf680a75ade43897b3d3d70d1ff4a96561/docs).

Leer un documento sin restaurarlo:

```bash
git show 293a86cf680a75ade43897b3d3d70d1ff4a96561:docs/tareas-fase-6.md
```

Extraer toda la documentación antigua fuera del árbol de trabajo:

```bash
mkdir -p /tmp/three-d-docs-historicos
git archive 293a86cf680a75ade43897b3d3d70d1ff4a96561 docs | tar -x -C /tmp/three-d-docs-historicos
```

Rutas históricas útiles: `docs/rendimiento-local.md`, `docs/assets/continuous-contract.md`, `docs/assets/polyhaven-manifest.json`, `docs/assets/organization-manifest.json`, `docs/exportacion-web-glb-unico.md`, `docs/fase-*-validacion.md` y `docs/evidencia/`.
