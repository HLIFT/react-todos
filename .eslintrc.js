module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'import/no-unresolved': ['off'],
    'import/prefer-default-export': ['off'],
    'import/no-default-export': ['error'],
    'react/react-in-jsx-scope': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/prop-types': ['off'],
    'no-console': ['off'],
    'import/extensions': ['off'],
  },
  overrides: [
    {
      files: ['vite.config.js'],
      rules: {
        'import/prefer-default-export': ['error'],
        'import/no-default-export': ['off'],
        'import/no-extraneous-dependencies': ['off'],
      },
    },
  ],
};
