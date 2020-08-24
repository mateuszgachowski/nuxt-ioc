/* eslint-disable no-unused-expressions */

import Container from './Container';
import Injectable from './Injectable';

/**
 * A simple type of constructor for class "T"
 */
type IClassType<T> = new () => T;

/**
 * Holds decorator entry struct. It is saved in __decorators array for every class and holds
 * various informations.
 */
interface IDecoratorEntry {
  classType: any;
  params: any;
  target: any;
  propertyName: string;
  descriptor: PropertyDescriptor;
}

/**
 * This is a type for every class instance that is decorated. It should contain hidden __decorators
 * array that holds information about all decorators used in this class. It will be used later for
 * turning those declarations for real code.
 */
interface IDecoratedPrototype {
  __decorators?: IDecoratorEntry[];
}

interface IDecoratedInstance {
  // tslint:disable-next-line:array-type
  __decoratorInstances?: BaseDecorator<any>[];
}

@Injectable()
/**
 * This is base class for all decorators used in livedata. Decorator class must extend this one.
 * This class instance is created using IOC container so you can @Inject() things here.
 */
export abstract class BaseDecorator<T> {
  /** Holds options object that is passed as 2nd argument in createDecorator() factory */
  public options!: T;

  /** Holds class instance that is decorated */
  public instance: any;

  /** Holds class prototype that is decorated */
  public prototype: any;

  /** Holds property name that was decorated */
  public propertyName!: string;

  /** Holds property descriptor that was decorated */
  public descriptor!: PropertyDescriptor;

  /**
   * This method is called when decorator is created and ready to be used.
   */
  public created(): void {}

  /**
   * This method is called when decorator is destroyed for cleanup tasks (like unregistering listeners, clearing timers).
   * For standard services it is called at the end of SSR requests and for Vue components it is called when component is
   * destroyed.
   */
  public destroyed(): void {}
}

/**
 * This function creates ES6 decorator based on class that was passed in argument.
 *
 * @param decoratorClass class of decorator that will be used
 * @param params custom options object that will be availalbe in "options" property of decorator class
 * @return ES6 decorator function
 */
export function createDecorator<P, T extends BaseDecorator<P>>(decoratorClass: IClassType<T>, params: P): Function {
  // standaard ES6 decorator code...
  return function internalDecorator(
    target: IDecoratedPrototype,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ): any {
    // if target instance does not have __decorators magic array, create it
    if (!target.__decorators) {
      target.__decorators = [];
    }

    // push decorator information to magic array
    target.__decorators.push({
      classType: decoratorClass,
      params,
      target,
      propertyName,
      descriptor,
    });
  };
}

/**
 * This interface repesents decorator metadata object for particular IOC container. We are storing this in
 * map, so we can properly cleaup after request.
 */
interface IContainerDecoratorMetadata {
  decoratedInstances: Map<IDecoratedInstance, BaseDecorator<unknown>[]>;
}

/**
 * This map holds map of Container:DecoratorMetadata values. For every container created,
 * we must hold array of decorated instances, we realize it by holding map where key is
 * container (for easier removal later) and value is IContainerDecoratorMetadataObject.
 */
const containerMap: Map<Container, IContainerDecoratorMetadata> = new Map();

/**
 * Helper function to query data from container
 * @param container container to get metadata fro
 * @return metadata object
 */
function getContainerMetadata(container: Container): IContainerDecoratorMetadata {
  if (!containerMap.has(container)) {
    containerMap.set(container, { decoratedInstances: new Map() });
  }
  return containerMap.get(container)!;
}

/**
 * This function initializes all registered decorators on particular instance. It must be called in order
 * for decorator code work in particular class.
 * @param target class instance to sue
 * @param container IOC container for context
 */
export function initializeDecorators(target: IDecoratedInstance, container: Container): void {
  // get target prototype where metadata is stored
  const prototype: IDecoratedPrototype = Object.getPrototypeOf(target);

  // iterate over __decorators magic field for class
  prototype.__decorators?.forEach((entry) => {
    // create decorator class instance using container so all @Injects will work
    const instance: BaseDecorator<unknown> = container.resolve(entry.classType);

    if (instance) {
      // fill instance with data and call the callback
      instance.options = entry.params;
      instance.instance = target;
      instance.prototype = prototype;
      instance.propertyName = entry.propertyName;
      instance.descriptor = entry.descriptor;

      instance.created();
    }

    // get container metadata from map
    const { decoratedInstances } = getContainerMetadata(container);

    // get instance list for this class (fallback to empty array) and add new instance
    const instanceList = decoratedInstances.get(target) ?? [];
    instanceList.push(instance);
    decoratedInstances.set(target, instanceList); // save it to instance list
  });
}

/**
 * This function is responsible for preparing IOC container to work with all decorators. It simply
 * initializes all decorators on all services registered.
 * @param container IOC container
 */
export function initializeContainer(container: Container): void {
  container.getAllServices().forEach((service: IDecoratedInstance) => initializeDecorators(service, container));
}

/**
 * This function releases all decorators applied to target instance by calling their .destroyed()
 * method. Its used to provide a way for cleanup for decorators. @see BaseDecorator.destroy()
 *
 * @param target instance of class that should have decorators cleaned up
 * @param container ioc container
 */
export function destroyDecorators(target: IDecoratedInstance, container: Container): void {
  // get container metadata from map
  const { decoratedInstances } = getContainerMetadata(container);

  // iterate over registered decorators in particular class
  const instanceList = decoratedInstances.get(target);
  instanceList?.forEach((instance) => instance.destroyed());

  // cleanup entry in instance map
  decoratedInstances.delete(target);
}

/**
 * This function is responsible for preparing IOC container to work with all decorators. It simply
 * initializes all decorators on all services registered.
 * @param container IOC container
 */
export function destroyContainer(container: Container): void {
  // destroy all decorators in service
  container.getAllServices().forEach((service: IDecoratedInstance) => destroyDecorators(service, container));

  // destroy the decorator data itself
  containerMap.delete(container);
}
