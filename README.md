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
  styles/       tokens, base y entrada de estilos
public/models/  modelos 3D
```

## Estilos

CSS propio para lo que es nuestro y Tailwind v4 para el layout y las utilidades predefinidas.

- **Tailwind**, en el template: grid, flex, espaciado, responsive y utilidades estándar.
- **CSS propio**, en `<style scoped>`: lo específico del componente (estados, animaciones, efectos). Para usar `@apply` o el tema dentro de un componente, empieza el bloque con `@reference '@/styles/main.css';`.
- **Tokens**, solo en `src/styles/tokens.css`, dentro de `@theme`. Cada token es a la vez variable CSS (`--color-accent`) y utilidad (`bg-accent`). Nada de colores ni medidas sueltas fuera de ahí.
- **Globales**, en `src/styles/base.css`, al mínimo. El reset lo pone el preflight de Tailwind.

Orden de la cascada: `theme`, `base`, `components`, `utilities`.

Las reglas entre capas están en [RULES.md](RULES.md) y se aplican en cada commit.
