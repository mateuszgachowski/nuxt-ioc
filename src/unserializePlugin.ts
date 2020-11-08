// @ts-ignore
import { initializeContainer } from '<%= options.coreModule %>';
// @ts-ignore
import container from '<%= options.containerPath %>';

/**
 * This plugin is for client side unserialization (IOC)
 */
export default function clientReadyPlugin() {
  if (process.server) {
    return;
  }
  setTimeout(() => initializeContainer(container), 0);
}
