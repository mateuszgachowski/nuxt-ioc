import { resolve } from 'path';
import Inject from './System/Inject';
import Injectable from './System/Injectable';
import { BaseDecorator, initializeContainer } from './System/Decorators';
import Events from './System/Events';
import StateSerializer from './System/StateSerializer';
import { Serializable } from './System/VueUtil';
import { BaseComponent, Prop, Meta, Components, factory } from './System/ComponentUtil';
import Container from './System/Container';
import Listen from './System/Decorator/Listen';
import BeforeFrontRenderEvent from './System/Event/BeforeFrontRenderEvent';

interface IModuleContext {
  addPlugin(options: Record<string, any>): void;
}

interface IModuleOptions {}

export = {
  Inject,
  Injectable,
  BaseDecorator,
  BaseComponent,
  Events,
  Prop,
  Meta,
  Listen,
  StateSerializer,
  Container,
  Serializable,
  Components,
  initializeContainer,
  factory,
  NuxtIocModule,
  BeforeFrontRenderEvent,
};

function NuxtIocModule(this: IModuleContext, moduleOptions: IModuleOptions) {
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
    src: resolve(__dirname, 'containerToVuePlugin.js'),
    options,
  });
  this.addPlugin({
    src: resolve(__dirname, 'unserializePlugin.js'),
    options,
  });
  this.addPlugin({
    src: resolve(__dirname, 'serializePlugin.js'),
    options,
  });
}

module.exports.meta = require('../package.json');
