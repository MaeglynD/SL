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
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {},
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
