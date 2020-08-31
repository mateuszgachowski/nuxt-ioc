import { Events, IEventType, IEventId } from '../Events';
import { BaseDecorator, createDecorator } from '../Decorators';
import { Injectable } from '../Injectable';
import { Inject } from '../Inject';

interface IListenDecoratorParams {
  eventType: IEventType<unknown>;
}

/**
 * This class is responsible for managing cache decorator.
 */
@Injectable()
class ListenDecorator extends BaseDecorator<IListenDecoratorParams> {
  @Inject(Events)
  private gEvents: Events;

  private fEvent: IEventId;

  /**
   * Called when decorator is initialized. It will register event listener that will call this function
   * once executed.
   */
  public created(): void {
    // listen on event type, and after it triggers, call proper method and return its result
    this.fEvent = this.gEvents.on(this.options.eventType, (data) => {
      this.instance[this.propertyName](data);
    });
  }

  /**
   * Called when decorator is destroyed. It will unregister event listener.
   */
  public destroyed(): void {
    // release event listener
    this.gEvents.off(this.fEvent);
  }
}

/**
 * This decorator stores metadata about event listeners. It can be later used along with function
 * applyEventListeners() to automatically register all listeners.
 *
 * @param eventType event to listen for
 * @return decorator function
 */
export function Listen(eventType: IEventType<unknown>): Function {
  return createDecorator(ListenDecorator, { eventType });
}
