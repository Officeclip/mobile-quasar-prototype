const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const vue = require('eslint-plugin-vue');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser'),
        extraFileExtensions: ['.vue'],
        project: true,
        tsconfigRootDir: 'C:\OfficeclipNew\mobile\mobile-quasar-prototype',
      },

      globals: {
        ...globals.browser,
        ...globals.node,
        ...vue.environments['setup-compiler-macros']['setup-compiler-macros'],
        ga: 'readonly',
        cordova: 'readonly',
        __statics: 'readonly',
        __QUASAR_SSR__: 'readonly',
        __QUASAR_SSR_SERVER__: 'readonly',
        __QUASAR_SSR_CLIENT__: 'readonly',
        __QUASAR_SSR_PWA__: 'readonly',
        process: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
      },
    },

    extends: compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:vue/vue3-essential',
      'prettier',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      vue,
    },

    rules: {
      'prefer-promise-reject-errors': 'off',

      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-unused-vars': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },
  {
    // ADD THIS NEW CONFIG OBJECT TO OVERRIDE THE RULE FOR THE CONFIG FILE ITSELF
    files: ['eslint.config.cjs'], // Target only this file
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Disable the rule for this file
    },
  },
  globalIgnores([
    'dist',
    'src-capacitor',
    'src-cordova',
    '.quasar',
    'node_modules',
    '**/.eslintrc.js',
    'src-ssr',
    // Ensure the temporary files are also ignored globally if they don't need any linting at all
    'quasar.config.js.temporary.compiled.*.mjs',
  ]),
]);
