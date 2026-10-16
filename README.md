# three-d

Portafolio personal de Yorman Castellanos: Vue 3 + Three.js.

- `master`: v1, en producción.
- `version-2`: experimento descartado.
- `version-3`: versión actual en desarrollo.

## Requisitos

Node `^20.19.0 || >=22.12.0` (ver `.nvmrc`).

## Comandos

```bash
npm install        # instala dependencias y el hook de pre-commit
npm run dev        # servidor de desarrollo
npm run lint       # ESLint, incluye las reglas de capas
npm run typecheck  # vue-tsc
npm run build      # typecheck + build de producción en dist/
```

## Estructura

```
src/
  scene/        Three.js puro
  content/      textos y configuración (solo datos)
  composables/  puente entre Vue y la escena
  components/   UI en Vue
public/models/  modelos 3D
```

Las reglas entre capas están en [RULES.md](RULES.md) y se aplican en cada commit.
