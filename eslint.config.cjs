const js = require('@eslint/js');
const jsdoc = require('eslint-plugin-jsdoc');
const nodePlugin = require('eslint-plugin-node');

module.exports = [
  {
    ignores: ['node_modules/', 'coverage/', 'urls.db'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        // Node globals
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // WHATWG URL in Node
        URL: 'readonly',
      },
    },
    plugins: {
      jsdoc,
      node: nodePlugin,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'jsdoc/require-returns': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
    },
  },
  {
    files: ['public/**/*'],
    languageOptions: {
      sourceType: 'script',
      globals: { window: 'readonly', document: 'readonly', fetch: 'readonly' },
    },
  },
  {
    files: ['tests/**/*'],
    languageOptions: {
      globals: { jest: 'readonly' },
    },
  },
];
