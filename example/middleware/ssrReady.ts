import 'reflect-metadata';
import { Context } from '@nuxt/types';
import { Events, StateSerializer, BeforeFrontRenderEvent, initializeContainer } from '../../';
import container from '../Application/container';

/**
 * This middleware serializes state only on backend side (IOC)
 */
export default function ssrReadyMiddleware(context: Context) {
  if (process.client) {
    return;
  }

  context.beforeNuxtRender(async ({ nuxtState }) => {
    // Initialize container
    initializeContainer(container);
    console.log(nuxtState);

    const stateSerializer = container.get(StateSerializer);
    const events = container.get(Events);
    await events.trigger(BeforeFrontRenderEvent);
    const initialState = stateSerializer.serialize(container);
    nuxtState.iocState = initialState;
  });
}
