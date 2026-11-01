// R7: los colores solo se definen en src/styles/tokens.css.
const COLOR_FUNCTIONS = ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix']
const MESSAGE = 'R7: los colores solo se definen en src/styles/tokens.css; usa un token.'

export default {
  overrides: [{ files: ['**/*.vue'], customSyntax: 'postcss-html' }],
  rules: {
    'color-no-hex': [true, { message: MESSAGE }],
    'color-named': ['never', { message: MESSAGE }],
    'function-disallowed-list': [COLOR_FUNCTIONS, { message: MESSAGE }],
  },
  ignoreFiles: ['dist/**', 'src/styles/tokens.css'],
}
