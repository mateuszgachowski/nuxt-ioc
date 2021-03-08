import Vue from 'vue';
// @ts-ignore
import { initializeContainer, StateSerializer } from '<%= options.coreModule %>';
// @ts-ignore
import appContainer from '<%= options.containerPath %>';

/**
 * This plugin is for client side unserialization (IOC)
 */
export default function clientReadyPlugin() {
  if (process.server) {
    return;
  }

  let container;

  if (typeof appContainer === 'function') {
    container = appContainer();
  } else {
    container = appContainer;
  }

  // Initialize container
  initializeContainer(container);

  Vue.prototype.$__container = container;

  const stateSerializer = container.get(StateSerializer);
  stateSerializer.unserialize(container, stateSerializer.getSerializedState());
}
