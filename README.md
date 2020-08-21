# nuxt-ioc

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> IOC implementation for Nuxt development

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `nuxt-ioc` dependency to your project

```bash
yarn add nuxt-ioc # or npm install nuxt-ioc
```

2. Add `nuxt-ioc` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'nuxt-ioc',

    // With options
    ['nuxt-ioc', { /* module options */ }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) mateusz.gachowski@gmail.com

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-ioc/latest.svg
[npm-version-href]: https://npmjs.com/package/nuxt-ioc

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-ioc.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-ioc

[github-actions-ci-src]: https://github.com/mateuszgachowski/nuxt-ioc/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/mateuszgachowski/nuxt-ioc/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/mateuszgachowski/nuxt-ioc.svg
[codecov-href]: https://codecov.io/gh/mateuszgachowski/nuxt-ioc

[license-src]: https://img.shields.io/npm/l/nuxt-ioc.svg
[license-href]: https://npmjs.com/package/nuxt-ioc
