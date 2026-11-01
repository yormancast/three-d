# Reglas duras

Reglas que se cumplen en cada commit, sin excepciones. Cada una tiene un mecanismo que la hace cumplir; si una regla no se puede comprobar con herramientas, no va aquí.

Para cambiar una regla se edita este archivo y su mecanismo en el mismo commit.

## Capas

```
src/
  scene/        Three.js puro
  content/      textos y configuración (solo datos)
  composables/  puente entre Vue y la escena
  components/   UI en Vue
```

### R1. `scene/` no conoce Vue ni el contenido

Nada dentro de `src/scene/` importa `vue`, `@/components`, `@/composables` ni `@/content`. Recibe su configuración por parámetro y se comunica hacia fuera con eventos tipados.

**Se cumple con:** `no-restricted-imports` de ESLint sobre `src/scene/**`.

### R2. La UI no conoce Three.js

Nada dentro de `src/components/` ni en la raíz de `src/` (`App.vue`, `main.ts`) importa `three`, `three/*` ni `@/scene`, ni siquiera tipos. La UI habla con la escena solo a través de `src/composables/`.

**Se cumple con:** `no-restricted-imports` de ESLint sobre `src/components/**` y `src/*.{ts,vue}`.

### R3. Solo `composables/` crea y controla la escena

`src/composables/` es la única capa que importa valores de `@/scene`. Fuera de `scene/` y `composables/`, `@/scene` solo se puede importar con `import type`.

**Se cumple con:** `no-restricted-imports` de ESLint: R2 lo bloquea en la UI y R4 solo permite `import type` en `content/`.

### R4. `content/` son datos

`src/content/` no importa `vue`, `three` ni `@/scene` (salvo `import type`). La relación entre secciones de la UI y estados de la escena vive aquí, no en los componentes ni en la escena.

**Se cumple con:** `no-restricted-imports` de ESLint sobre `src/content/**`.

Las restricciones de importación cubren tanto el alias `@/` como las rutas relativas.

## Tipos

### R5. TypeScript estricto y sin `any`

`strict: true` en `tsconfig`. Prohibido `any` explícito y prohibido declarar módulos sin tipos (`declare module 'x';`) para librerías que tienen los suyos.

**Se cumple con:** `@typescript-eslint/no-explicit-any` en `error`, `no-restricted-syntax` contra `declare module 'x';` y `vue-tsc -b`.

## Cada commit

### R6. Nada entra sin pasar las comprobaciones

Antes de cada commit se ejecuta `npm run check`: formato (Prettier), lint (ESLint y Stylelint), type-check (`vue-tsc`) y tests (Vitest). Si algo falla, el commit no se crea. En CI se repite junto con el build, y un PR que no pasa no se mergea.

**Se cumple con:** hook de pre-commit (`simple-git-hooks`, se instala con `npm install`) y `.github/workflows/ci.yml`.

## Estilos

### R7. Los estilos son de la UI y los colores, de los tokens

- `src/scene/` no toca estilos del DOM (`style`, `classList`, `className`, ni `setAttribute('style' | 'class')`). El canvas lo estiliza la UI.
- `src/scene/` no escribe colores literales (`0xff8800`, `'#ff8800'`). Le llegan por configuración.
- Los colores solo se definen en `src/styles/tokens.css`. En el resto del CSS y en los `<style>` de los componentes se usan tokens: nada de hex, nombres de color ni funciones de color (`rgb()`, `oklch()`…).
- En los templates no se usan valores de color arbitrarios de Tailwind (`bg-[#fff]`).

**Se cumple con:** `no-restricted-syntax` de ESLint sobre `src/scene/**`, Stylelint (`color-no-hex`, `color-named`, `function-disallowed-list`) y `vue/no-restricted-class`.

## Estado de los mecanismos

| Regla | Mecanismo                                                    | Estado |
| ----- | ------------------------------------------------------------ | ------ |
| R1–R4 | `eslint.config.js`, `no-restricted-imports`                  | Activo |
| R5    | `tsconfig.app.json` + `eslint.config.js` + `vue-tsc`         | Activo |
| R6    | `simple-git-hooks` (pre-commit) + `.github/workflows/ci.yml` | Activo |
| R7    | `eslint.config.js` + `stylelint.config.js`                   | Activo |
