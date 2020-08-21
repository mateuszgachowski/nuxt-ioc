const { resolve } = require('path')

module.exports = function (moduleOptions) {
  const options = {
    ...this.options['nuxt-ioc'],
    ...moduleOptions
  }

  this.addPlugin({
    src: resolve(__dirname, 'plugin.ts'),
    fileName: 'nuxt-ioc.js',
    options
  })
}

module.exports.meta = require('../package.json')
