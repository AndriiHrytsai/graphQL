module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used' }],
    complexity: ['error', 20],
    'no-alert': 'error',
  },
};
