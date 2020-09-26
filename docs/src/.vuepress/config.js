const { description } = require('../../package');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'nuxt-ioc',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  base: '/nuxt-ioc/',

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'mateuszgachowski/nuxt-ioc',
    docsRepo: 'mateuszgachowski/nuxt-ioc',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'NPM',
        link: 'https://www.npmjs.com/package/nuxt-ioc',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            'installation',
            'settings',
            'components',
            'component-decorators',
            'structure',
            'event-system',
            'serialization',
            'testing',
          ],
        },
      ],
    },
  },

  markdown: {
    lineNumbers: true,
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-179095821-1',
      },
    ],
  ],
};
