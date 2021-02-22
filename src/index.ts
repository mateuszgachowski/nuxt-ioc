import { resolve } from 'path';
export * from './System/Inject';
export * from './System/Injectable';
export * from './System/Container';
export * from './System/StateSerializer';
export * from './System/Decorators';
export * from './System/Events';
export * from './System/VueUtil';
export * from './System/ComponentUtil';
export * from './System/Decorator/Listen';
export * from './System/Event/BeforeFrontRenderEvent';

interface IModuleContext {
  addPlugin(options: Record<string, any>): void;
}

interface IModuleOptions {}

export default function NuxtIocModule(this: IModuleContext, moduleOptions: IModuleOptions) {
  // @ts-ignore
  // process.env.NUXT_ENV_DEVALUE_LOG_LIMIT = -1;
  const options = {
    // @ts-ignore
    containerPath: '~/Application/container',
    coreModule: 'nuxt-ioc',
    // coreModule: '../../',
    ...moduleOptions,
  };
  this.addPlugin({
    src: resolve(__dirname, 'unserializePlugin.js'),
    options,
  });
  this.addPlugin({
    src: resolve(__dirname, 'serializePlugin.js'),
    options,
  });
}

export const meta = require('../package.json');
