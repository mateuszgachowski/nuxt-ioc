module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['eslint-plugin-import-alias', 'json-format'],
  rules: {
    'import/no-unresolved': 0,
    'import-alias/import-alias': [
      'error',
      {
        rootDir: __dirname,
        relativeDepth: 0,
        aliases: [
          {
            alias: '@Domain',
            matcher: '^Domain',
          },
          {
            alias: '@Utils',
            matcher: '^Utils',
          },
          {
            alias: '@System',
            matcher: '^System',
          },
        ],
      },
    ],
  },
};
