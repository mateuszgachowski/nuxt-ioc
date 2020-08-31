import 'reflect-metadata';
import { resolve } from 'path';

module.exports = {
  mode: 'universal',
  buildModules: ['@nuxt/typescript-build'],
  render: {
    bundleRenderer: {
      runInNewContext: false,
    },
  },
  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  router: {
    middleware: [],
  },
  modules: ['~/../../'],
};
