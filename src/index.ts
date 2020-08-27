import { resolve } from 'path';
import Inject from './System/Inject';
import Injectable from './System/Injectable';
import { BaseDecorator, initializeContainer } from './System/Decorators';
import Events from './System/Events';
import StateSerializer from './System/StateSerializer';
import { Serializable } from './System/VueUtil';
import { BaseComponent, Prop, Meta, factory } from './System/ComponentUtil';
import Container from './System/Container';
import Listen from './System/Events';
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
  initializeContainer,
  factory,
  NuxtIocModule,
  BeforeFrontRenderEvent,
};

function NuxtIocModule(this: IModuleContext, moduleOptions: IModuleOptions) {
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
