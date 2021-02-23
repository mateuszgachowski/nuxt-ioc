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
export default function ssrReadyMiddleware(context: Context) {
  if (process.client) {
    return;
  }

  let container: Container;

  if (typeof appContainer === 'function') {
    container = appContainer();
  } else {
    container = appContainer;
  }

  // Initialize container
  initializeContainer(container);

  Vue.prototype.__container = container;

  (context as any).req.__container = container;

  context.beforeNuxtRender(async ({ nuxtState }) => {
    const stateSerializer = container.get(StateSerializer);
    const events = container.get(Events);
    await events.trigger(BeforeFrontRenderEvent);
    const initialState = stateSerializer.serialize(container);
    nuxtState.iocState = initialState;

    // Fixes memory leak as some decorators were registering
    // after container destroyed
    // on event loop everything seems to be working fine
    // (tested on 1000req / s / 5 tries)
    setTimeout(() => destroyContainer(container), 0);
  });
}
