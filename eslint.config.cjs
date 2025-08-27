/* eslint-env node */
const { defineConfig, globalIgnores } = require('eslint/config');
const globals = require('globals');
const js = require('@eslint/js');
const vue = require('eslint-plugin-vue');
const prettier = require('eslint-config-prettier');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig([
  // Base parser for Vue SFCs
  {
    languageOptions: {
      parser: require('vue-eslint-parser'),
      parserOptions: {
        // keep it QUIET: no TS project mode
        parser: require.resolve('@typescript-eslint/parser'),
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...vue.environments['setup-compiler-macros']['setup-compiler-macros'],
      },
    },
  },

  // Base JS rules (minimal)
  js.configs.recommended,

  // Vue “essential” (low-noise) flat preset
  ...vue.configs['flat/essential'],

  // Disable stylistic rules that fight Prettier
  prettier,

  // Your minimal repo rules. All WARN except true foot-guns.
  {
    plugins: {
      // keep existing plugins (vue, etc.)
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // let warnings exist; we’ll hide them in CLI with --quiet
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // keep only real errors:
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Ignore generated/legacy areas
  globalIgnores([
    'dist',
    '.quasar',
    'node_modules',
    'coverage',
    'src-capacitor',
    'src-cordova',
    'src-ssr',
  ]),
]);
