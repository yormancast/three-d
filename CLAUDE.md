# three-d

Portafolio personal en Vue 3 + Three.js.

Las reglas de [RULES.md](RULES.md) son obligatorias en cada cambio. Antes de dar por terminado un cambio, comprueba que no rompe ninguna. Si una tarea solo se puede hacer rompiendo una regla, para y pregunta.

Para verificar un cambio: `npm run lint` y `npm run typecheck` (el hook de pre-commit los ejecuta). Usa npm 11 (`npx npm@11 install ...`) para añadir dependencias: npm 10 falla al resolver Vite con "Cannot read properties of null (reading 'edgesOut')".
