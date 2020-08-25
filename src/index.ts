import { resolve } from 'path';
export * as Inject from './System/Inject';
export * as Injectable from './System/Injectable';
export * as Container from './System/Container';

interface IModuleContext {
  addPlugin(options: Record<string, any>): void;
}

interface IModuleOptions {}

export default function NuxtIocModule(this: IModuleContext, moduleOptions: IModuleOptions) {
  const options = {
    // @ts-ignore
    containerPath: '~/Application/container',
    ...moduleOptions,
  };

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    options,
  });
}

module.exports.meta = require('../package.json');
