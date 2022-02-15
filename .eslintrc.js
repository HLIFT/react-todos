module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'import/no-unresolved': ['off'],
    'import/prefer-default-export': ['off'],
    'import/no-default-export': ['error'],
    'react/react-in-jsx-scope': ['off'],
    'react/prop-types': ['off'],
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
