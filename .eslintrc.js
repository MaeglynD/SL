module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'no-unused-vars': 'off',
    'linebreak-style': 0,
    'no-param-reassign': ['error', { props: false }],
    'no-shadow': 0,
    'import/no-extraneous-dependencies': 0,
  },
  settings: {
    'import/core-modules': [
      'vuetify',
      'vuetify/es5/util/colors',
    ],
    'import/resolver': {
      alias: {
        map: [
          ['@', '.'],
        ],
        extensions: ['.vue', '.js'],
      },
    },
  },
};
