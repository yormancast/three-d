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

Nada dentro de `src/components/` importa `three`, `three/*` ni `@/scene`. La UI habla con la escena solo a través de `src/composables/`.

**Se cumple con:** `no-restricted-imports` de ESLint sobre `src/components/**`.

### R3. Solo `composables/` crea y controla la escena

`src/composables/` es la única capa que importa valores de `@/scene`. Fuera de `scene/` y `composables/`, `@/scene` solo se puede importar con `import type`.

**Se cumple con:** `no-restricted-imports` de ESLint sobre `src/**` excepto `src/scene/**` y `src/composables/**`, permitiendo importaciones de solo tipos.

### R4. `content/` son datos

`src/content/` no importa `vue`, `three` ni `@/scene` (salvo `import type`). La relación entre secciones de la UI y estados de la escena vive aquí, no en los componentes ni en la escena.

**Se cumple con:** `no-restricted-imports` de ESLint sobre `src/content/**`.

## Tipos

### R5. TypeScript estricto y sin `any`

`strict: true` en `tsconfig`. Prohibido `any` explícito y prohibido declarar módulos sin tipos (`declare module 'x';`) para librerías que tienen los suyos.

**Se cumple con:** `@typescript-eslint/no-explicit-any` en `error` y `vue-tsc --noEmit`.

## Cada commit

### R6. Nada entra sin pasar lint y type-check

Antes de cada commit se ejecutan `lint` y `typecheck`. Si alguno falla, el commit no se crea. En CI se repiten junto con `build`, y un PR que no pasa no se mergea.

**Se cumple con:** hook de pre-commit y workflow de CI.

## Estado de los mecanismos

| Regla | Mecanismo | Estado |
| --- | --- | --- |
| R1–R4 | ESLint `no-restricted-imports` | Pendiente (se configura con el proyecto v3) |
| R5 | `tsconfig` + ESLint + `vue-tsc` | Pendiente |
| R6 | Hook pre-commit + CI | Pendiente |
