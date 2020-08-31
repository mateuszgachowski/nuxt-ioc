// @ts-ignore
import { StateSerializer, initializeContainer } from '<%= options.coreModule %>';
// @ts-ignore
import container from '<%= options.containerPath %>';

/**
 * This plugin is for client side unserialization (IOC)
 */
export default function clientReadyPlugin() {
  if (process.server) {
    return;
  }

  // Initialize container
  initializeContainer(container);

  const stateSerializer = container.get(StateSerializer);
  stateSerializer.unserialize(container, stateSerializer.getSerializedState());
}
