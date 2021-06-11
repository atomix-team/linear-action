/* eslint-disable sonarjs/no-duplicate-string */
module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
  env: {
    test: {
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src/'],
          },
        ],
      ],
    },
  },
};