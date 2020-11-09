import 'reflect-metadata';
import { Context } from '@nuxt/types';
// @ts-ignore
import { Events, StateSerializer, BeforeFrontRenderEvent, initializeContainer } from '<%= options.coreModule %>';
// @ts-ignore
import container from '<%= options.containerPath %>';

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

    const stateSerializer = container.get(StateSerializer);
    const events = container.get(Events);
    await events.trigger(BeforeFrontRenderEvent);
    const initialState = stateSerializer.serialize(container);
    nuxtState.iocState = initialState;
  });
}
