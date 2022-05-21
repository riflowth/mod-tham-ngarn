module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: __dirname,
      },
    },
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'import/no-unresolved': 'error',

    // allow console logging for nodejs
    'no-console': 'off',

    'import/prefer-default-export': 'off',

    'padded-blocks': [
      'error',
      { classes: 'always' },
    ],
    'arrow-body-style': 'off',

    'class-methods-use-this': 'off',

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],

    // except empty line after attribute scope variable declarations
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
  },
};
