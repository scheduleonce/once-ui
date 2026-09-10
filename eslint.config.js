// @ts-check
const { defineConfig } = require('@eslint/config-helpers');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig(
  {
    ignores: ['projects/**/*'],
  },
  {
    files: ['**/*.ts'],
    linterOptions: {
      // Suppress "unused eslint-disable directive" warnings. Many existing
      // `eslint-disable` comments reference rules that are no longer active in
      // the @angular-eslint v22 / @typescript-eslint v8 recommended configs.
      reportUnusedDisableDirectives: 'off',
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
    rules: {
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
      // rules added
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
      // Disabled to preserve pre-migration lint behavior:
      // - `prefer-on-push` is new in @angular-eslint v22 and conflicts with the
      //   library's intentional use of `ChangeDetectionStrategy.Eager` in tests.
      // - `no-unsafe-argument` was commented out in the legacy eslintrc config.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
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
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  }
);