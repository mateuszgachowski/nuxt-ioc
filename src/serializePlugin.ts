import 'reflect-metadata';
import Vue from 'vue';
import { Context } from '@nuxt/types';
import {
  Events,
  StateSerializer,
  BeforeFrontRenderEvent,
  initializeContainer,
  Container,
  destroyContainer,
  // @ts-ignore
} from '<%= options.coreModule %>';
// @ts-ignore
import appContainer from '<%= options.containerPath %>';

/**
 * This middleware serializes state only on backend side (IOC)
 */
export default function ssrReadyMiddleware(this: any, context: Context, inject: Function) {
  if (process.client) {
    return;
  }

  let container: Container;

  if (typeof appContainer === 'function') {
    container = appContainer();
  } else {
    container = appContainer;
  }

  const req = (context as any).req;
  req.$__container = container;

  inject('__container', container);

  // Initialize container
  initializeContainer(container);

  context.beforeNuxtRender(async ({ nuxtState }) => {
    const stateSerializer = container.get(StateSerializer);
    const events = container.get(Events);
    await events.trigger(BeforeFrontRenderEvent);
    const initialState = stateSerializer.serialize(container);
    nuxtState.iocState = initialState;
  });

  if (req && req.on) {
    req.on('end', () => {
      destroyContainer(container);
      req.$__container = undefined;
    });

    req.on('error', (err: any) => {
      destroyContainer(container);
      req.$__container = undefined;
    });
  }
}
