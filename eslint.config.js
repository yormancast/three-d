// Las reglas de capas y tipos de RULES.md se hacen cumplir aquí.
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

// Coincide con el alias `@/<capa>` y con rutas relativas hacia esa capa.
const layer = (name) => `^(@/|(\\.{1,2}/)+)${name}(/|$)`

const forbid = (regex, message, allowTypeImports = false) => ({ regex, message, allowTypeImports })

const VUE = forbid('^(vue|@vue/.*)$', 'Esta capa no puede depender de Vue.')
const THREE = forbid('^three(/|$)', 'Esta capa no puede depender de Three.js.')
const NO_UNTYPED_MODULES = {
  selector: 'TSModuleDeclaration[kind="module"]:not([body])',
  message: 'R5: no declares módulos sin tipos; instala o escribe sus tipos.',
}
const ARBITRARY_COLOR_CLASS = '/\\[(#|(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\\()/'

const restrict = (...patterns) => ({
  '@typescript-eslint/no-restricted-imports': ['error', { patterns }],
})

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,

  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
      globals: { ...globals.browser },
    },
    rules: {
      // R5
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': ['error', NO_UNTYPED_MODULES],
      // R7: en el template, nada de colores arbitrarios de Tailwind (bg-[#fff]).
      'vue/no-restricted-class': ['error', ARBITRARY_COLOR_CLASS],
    },
  },

  {
    files: ['eslint.config.js', 'vite.config.ts'],
    languageOptions: { globals: { ...globals.node } },
  },

  // R1: la escena no conoce Vue ni el contenido.
  // R7: la escena no toca estilos del DOM ni define colores propios.
  {
    files: ['src/scene/**'],
    rules: {
      ...restrict(
        { ...VUE, message: 'R1: scene/ no puede depender de Vue.' },
        forbid(layer('(components|composables|content)'), 'R1: scene/ no puede importar UI, composables ni contenido.'),
      ),
      'no-restricted-syntax': [
        'error',
        NO_UNTYPED_MODULES,
        {
          selector: 'MemberExpression[property.name=/^(style|classList|className)$/]',
          message: 'R7: scene/ no toca estilos del DOM; el canvas lo estiliza la UI.',
        },
        {
          selector:
            'CallExpression[callee.property.name=/^(setAttribute|toggleAttribute)$/][arguments.0.value=/^(style|class)$/]',
          message: 'R7: scene/ no toca estilos del DOM; el canvas lo estiliza la UI.',
        },
        {
          selector:
            'Literal[raw=/^0x[0-9a-fA-F]{6}$/], Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
          message: 'R7: scene/ no define colores; llegan por configuración.',
        },
      ],
    },
  },

  // R2 y R3: la UI no conoce Three.js ni la escena.
  {
    files: ['src/components/**', 'src/*.{ts,vue}'],
    rules: restrict(
      { ...THREE, message: 'R2: la UI no puede importar Three.js.' },
      forbid(layer('scene'), 'R2: la UI habla con la escena solo a través de composables/.'),
    ),
  },

  // R4 y R3: el contenido son datos; de la escena solo tipos.
  {
    files: ['src/content/**'],
    rules: restrict(
      { ...VUE, message: 'R4: content/ no puede depender de Vue.' },
      { ...THREE, message: 'R4: content/ no puede depender de Three.js.' },
      forbid(layer('(components|composables)'), 'R4: content/ no puede importar UI ni composables.'),
      forbid(layer('scene'), 'R3: content/ solo puede importar tipos de scene/ (import type).', true),
    ),
  },
)
