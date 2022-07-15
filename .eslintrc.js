module.exports = {
  root: true,
  env: {
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/resolver': {
      node: { extensions: ['.js', '.ts', '.tsx'] }
    }
  },
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'implicit-arrow-linebreak': 'off',
    'import/extensions': ['off', 'ignorePackages', { ts: 'never' }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'warn',
      { devDependencies: ['**/*.spec.ts', 'src/__tests__/**/*.ts'] }
    ],
    'no-underscore-dangle': 'off',
    'no-useless-constructor': 'off',
    'prettier/prettier': 'error',
    'space-before-function-paren': 'off'
  }
}
