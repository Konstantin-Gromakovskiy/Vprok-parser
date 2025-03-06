import globals from 'globals';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
  ...compat.extends('airbnb'),
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    ignores: ['node_modules', 'eslint.config.js'],
    rules: {
      'import/extensions': ['error', 'always'],
      'no-console': 'off',
      'no-unused-vars': ['error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-shadow': 'off',
    },
  },
];
