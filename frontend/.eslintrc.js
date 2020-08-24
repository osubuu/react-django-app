module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'quotes': [2, 'single', 'avoid-escape'],
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'semi': [2, "always"],
  },
};
