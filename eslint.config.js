import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import preferArrowPlugin from 'eslint-plugin-prefer-arrow';
import storybookPlugin from 'eslint-plugin-storybook';

// Shared globals
const browserGlobals = {
  // Browser globals
  document: 'readonly',
  window: 'readonly',
  navigator: 'readonly',
  console: 'readonly',
  fetch: 'readonly',
  Promise: 'readonly',
  getComputedStyle: 'readonly',
  event: 'readonly',
  // other globals
  setTimeout: 'readonly',
  setInterval: 'readonly',
  clearTimeout: 'readonly',
  clearInterval: 'readonly',
};

const testGlobals = {
  // Jasmine test globals
  describe: 'readonly',
  it: 'readonly',
  xit: 'readonly',
  xdescribe: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  expect: 'readonly',
  jasmine: 'readonly',
  spyOn: 'readonly',
  fail: 'readonly',
};

// Shared TypeScript rules
const typescriptRules = {
  // ESLint recommended rules
  ...js.configs.recommended.rules,

  // TypeScript ESLint recommended rules
  ...tsPlugin.configs.recommended.rules,
  ...tsPlugin.configs['recommended-requiring-type-checking'].rules,

  // Angular ESLint recommended rules
  ...angularPlugin.configs.recommended.rules,

  // Disabled/custom rules
  '@angular-eslint/prefer-standalone': 'off',
  '@angular-eslint/component-class-suffix': 'off',
  '@angular-eslint/directive-class-suffix': 'off',
  '@typescript-eslint/consistent-type-definitions': 'error',
  '@typescript-eslint/explicit-member-accessibility': [
    'off',
    {
      accessibility: 'explicit',
    },
  ],
  '@typescript-eslint/no-non-null-assertion': 'off',
  'brace-style': ['off', '1tbs'],
  complexity: 'error',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@angular-eslint/no-output-native': 'off',
  '@typescript-eslint/no-unnecessary-type-assertion': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off',
  '@angular-eslint/no-input-rename': 'off',
  '@typescript-eslint/unbound-method': 'off',
  '@angular-eslint/no-conflicting-lifecycle': 'off',
  'no-self-assign': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  'no-useless-escape': 'off',
  '@typescript-eslint/prefer-regexp-exec': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-unsafe-function-type': 'off',
  '@typescript-eslint/no-unsafe-enum-comparison': 'off',
  '@typescript-eslint/no-base-to-string': 'off',
  'no-redeclare': 'off',
  '@angular-eslint/component-selector': [
    'error',
    {
      type: 'element',
      prefix: ['once', 'oui'],
      style: 'kebab-case',
    },
  ],
  '@angular-eslint/directive-selector': [
    'error',
    {
      type: 'attribute',
      prefix: ['once', 'oui'],
      style: 'camelCase',
    },
  ],
};

// HTML template rules (disable type-checking rules that don't apply to templates)
const htmlTemplateRules = {
  ...angularTemplatePlugin.configs.recommended.rules,
  ...angularTemplatePlugin.configs['process-inline-templates'].rules,
  // Disable all TypeScript type-checking rules for HTML templates
  ...Object.keys(
    tsPlugin.configs['recommended-requiring-type-checking'].rules
  ).reduce((acc, ruleName) => {
    acc[ruleName] = 'off';
    return acc;
  }, {}),
};

// Shared TypeScript plugins
const typescriptPlugins = {
  '@typescript-eslint': tsPlugin,
  '@angular-eslint': angularPlugin,
  import: importPlugin,
  jsdoc: jsdocPlugin,
  'prefer-arrow': preferArrowPlugin,
  storybook: storybookPlugin,
};

// Shared TypeScript parser options
const typescriptParserOptions = {
  parser: tsParser,
  parserOptions: {
    project: ['tsconfig.json'],
    createDefaultProgram: true,
    sourceType: 'module',
  },
  ecmaVersion: 'latest',
  sourceType: 'module',
};

export default [
  // Global ignore patterns
  {
    ignores: [
      'projects/**/*',
      'dist/**/*',
      'node_modules/**/*',
      '.angular/**/*',
    ],
  },

  // TypeScript files configuration (non-test)
  {
    files: ['**/*.ts', '!**/*.spec.ts'],
    languageOptions: {
      ...typescriptParserOptions,
      globals: browserGlobals,
    },
    plugins: typescriptPlugins,
    rules: typescriptRules,
  },

  // TypeScript spec files (.spec.ts) configuration
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      ...typescriptParserOptions,
      globals: {
        ...browserGlobals,
        ...testGlobals,
      },
    },
    plugins: typescriptPlugins,
    rules: typescriptRules,
  },

  // HTML template files configuration
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: htmlTemplateRules,
  },
];
