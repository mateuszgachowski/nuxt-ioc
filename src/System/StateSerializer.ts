import 'reflect-metadata';
import { IObservedClass } from './VueUtil';
import { Injectable } from './Injectable';
import { Container } from './Container';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IStateValue = any;

/**
 * Represents shape of serialized state JSON; its serialized to state class property
 * It looks like this:
 *
 * {
 *   "Home:CounterService": {
 *     "state": {
 *       "counter": 50,
 *     }
 *   }
 * }
 */
export interface ISerializedState {
  [key: string]: IStateValue;
}

export interface ISerializableObject extends IObservedClass {
  [key: string]: IStateValue;
}

@Injectable()
/**
 *
 */
export class StateSerializer {
  /** Array of custom classes that should be serialized as well */
  private fManualSerializableClasses: ISerializableObject[] = [];

  /**
   * Holds parsed state
   */
  public state: ISerializedState;

  /**
   * Returns if service contains serializable field of particular key.
   *
   * @param service service to be checked
   * @param serviceKey key of service that was used with @Serialize() decorator
   * @return true if that service exists, false otherwise
   */
  public hasSerializableKey(service: ISerializableObject, serviceKey: string): boolean {
    // if this service does not have any observables, return false
    if (!service.__observables) {
      return false;
    }

    // return if service has this key
    return service.__observables.some((entry) => entry.serviceKey === serviceKey);
  }

  /**
   * Adds instance to be a part of serialization process. This is required when you have to serialize
   * things that are outside of standard IOC service list (eg. vue components).
   * @param instance instance that will be serialized
   */
  public addCustomSerializable(instance: ISerializableObject): void {
    this.fManualSerializableClasses.push(instance);
  }

  /**
   * Serializes state from all compatabile IOC services into single object.
   * @param container front IOC container to serialize
   * @return serialized state object
   */
  public serialize(container: Container): ISerializedState {
    // prepare result object
    const result: ISerializedState = {};

    // serialize all container services + instances we registered with addCustomSerializable()
    const toSerializeServices = [...container.getAllServices(), ...this.fManualSerializableClasses];

    // iterate over all services and serialize them
    toSerializeServices.forEach((service: ISerializableObject) => {
      this.serializeService(service, result);
    });

    if (process.server && !(process.env.NODE_ENV === 'production')) {
      const size = Buffer.byteLength(JSON.stringify(result), 'utf-8');
      console.log('InitialState', `Size of serialized initial state: ${size / 1000}kb`);
    }

    return result;
  }

  /**
   * Unserializes state from object and injects it into all compatabile IOC services.
   * @param container IOC container to serialize
   * @param state serialized state object
   */
  public unserialize(container: Container, state: ISerializedState): void {
    // iterate over all services and unserialize them
    container.getAllServices().forEach((service: ISerializableObject) => {
      this.unserializeService(service, state);
    });
  }

  /**
   * Serializes all properties of service and stores it in result object
   * @param service service class instance to serialize
   * @param result result object to append data
   */
  public serializeService(service: ISerializableObject, result: ISerializedState): void {
    // if this service does not contain any @Serializable decorator, skip it
    if (!service.__observables) {
      return;
    }

    // iterate over all observable entries
    service.__observables.forEach(({ serviceKey, propertyName }) => {
      // determine a key - its either standard serviceKey or serviceKey + uid if instance has it
      const key = service.uid ? `${serviceKey}-${service.uid}` : serviceKey;

      // if this is new service key, create it
      if (!result[key]) {
        result[key] = {};
      }

      // if we already have this value defined, its name conflict and we throw
      if (result[key][propertyName]) {
        throw new Error(`StateSerializer.serializeService() - conflicting @Serializable() key: ${key}`);
      }

      // store property for that service
      result[key][propertyName] = service[propertyName];
    });
  }

  /**
   * Unserializes service based on global state object passed.
   * @param service service to potentailly unserialize
   * @param state global state object
   */
  public unserializeService(service: ISerializableObject, state: ISerializedState): void {
    // if this service does not contain any @Serializable decorator, skip it
    if (!service.__observables) {
      return;
    }

    // iterate over all observable entries
    service.__observables.forEach(({ serviceKey, propertyName }) => {
      // determine a key - its either standard serviceKey or serviceKey + uid if instance has it
      const key = service.uid ? `${serviceKey}-${service.uid}` : serviceKey;

      // if state does not contain data for this key, skip it
      if (!state || !state[key]) {
        return;
      }

      // restore state for object
      service[propertyName] = state[key][propertyName];
    });
  }

  /**
   * Returns state in raw format
   * @returns raw state
   */
  public retrieveState(): ISerializedState {
    return (window as any).__NUXT__;
  }

  /**
   * Gets the encoded state from html and returns as serialized
   * @returns serialized state
   */
  public getSerializedState(): ISerializedState {
    // If state already parsed, return it
    if (this.state) {
      return this.state;
    }

    try {
      // Set state to class property
      this.state = this.retrieveState();

      return this.state;
    } catch (error) {
      console.error('State', 'Cannot serialize state');

      // On error clear the state to prevent any conflicts
      this.state = {};
      return {};
    }
  }
}
