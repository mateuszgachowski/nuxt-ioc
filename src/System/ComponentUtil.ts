/* eslint-disable unicorn/number-literal-case */
/* eslint-disable no-useless-call */
/* eslint-disable no-invalid-this */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import Vue, { ComponentOptions, PropOptions, Component, AsyncComponent, WatchOptions } from 'vue';
import _merge from 'lodash/merge';
import { initializeDecorators, destroyDecorators } from './Decorators';
import { Injectable } from './Injectable';
import { Container } from './Container';
import { StateSerializer } from './StateSerializer';

/**
 * Returns type of property declared in class, using reflect-metadata.
 * @param target class type to get property type from
 * @param propName property name
 * @returns type of property
 */
function getReflectionType(target: BaseComponent, propName: string): any {
  const isReflectionSupported = typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined';
  return isReflectionSupported ? Reflect.getMetadata('design:type', target, propName) : undefined;
}

/**
 * Returns target than can be used to store meta values. It always returns
 * constructor function, no matter what is passed
 * @param target constructor function or class prototype
 * @return class constructor function
 */
function getClassOfTarget(target: any): any {
  const ctor = typeof target === 'function' ? target : target.constructor;
  if (!ctor.__options) {
    ctor.__options = {
      props: {},
      components: {},
      watch: {},
    };
  }
  return ctor;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This is @Prop decorator function that allows to change class variable to vue component property.
 * Using reflect-metadata, this decorator automatically determine type of variable and prepare
 * proper "props" object for Vue internally.
 *
 * Example:
 *
 * class Test {
 *  @Prop() value: string;
 * }
 *
 * <Test value="asdasd"/>
 *
 * @param options options for property, compatabile with vue property options
 * @returns decorator function
 */
export function Prop<T extends BaseComponent>(options: PropOptions = {}): Function {
  return function decorator(target: T, propertyName: string) {
    const reflectionType = getReflectionType(target, propertyName);
    if (!options.type && reflectionType) {
      options.type = reflectionType;
    }

    const classOfTarget: any = getClassOfTarget(target);
    classOfTarget.__options.props[propertyName] = options;

    /**
     * add new getter to target class with property name for using as a vue props in component
     * Example:
     *
     *  class Test extends BaseComponent {
     *    @Prop()
     *    private test: number;
     *
     *    $mounted() {
     *      console.log(this.test);
     *    }
     *  }
     */
    Object.defineProperty(target, propertyName, {
      get(): any {
        return (this as any).$vue.$props[propertyName];
      },
    });
  };
}

/**
 * Decorator for getting router params.
 *
 * @example
 *
 * Class Test extends BaseComponent {
 *    @RouterParam()
 *    private test: string;
 *
 *    $mounted() {
 *      console.los(this.test);
 *    }
 * }
 *
 * @param {String} key name of route param
 * @returns decorator function
 */
export function RouterParam<T extends BaseComponent>(key?: string): Function {
  return function decorator(target: T, paramName: string) {
    Object.defineProperty(target, paramName, {
      get(): any {
        const currentParamName = key || paramName;
        const { params = { [currentParamName]: '' } } = (this as any).$vue.$route;
        return currentParamName === 'params' ? params : params[currentParamName];
      },
    });
  };
}

/**
 * Decorator for getting router query.
 *
 * @example
 *
 * Class Test extends BaseComponent {
 *    @RouteQuery()
 *    private test: string;
 *
 *    $mounted() {
 *      console.los(this.test);
 *    }
 * }
 *
 * @param {String} key name of route query
 * @returns decorator function
 */
export function RouterQuery<T extends BaseComponent>(key?: string): Function {
  return function decorator(target: T, paramName: string) {
    Object.defineProperty(target, paramName, {
      get(): any {
        const currentQueryName = key || paramName;
        const { query = { [currentQueryName]: '' } } = (this as any).$vue.$route;
        return currentQueryName === 'query' ? query : query[currentQueryName];
      },
    });
  };
}

/**
 * This is @Watch decorator function that allows to watch vue properties in class.
 *
 * Example:
 *
 * class Test {
 *  public get someVariable() {
 *    return this.store.test;
 *  }
 *
 *  @Watch('someVariable', { deep: true,  immediate: false})
 *  public onChange() {
 *    console.log('value has changed');
 *  }
 * }
 *
 *
 * @param {String} propertyName name of class property to watch
 * @param {WatchOptions} options vue watch options
 * @returns decorator function
 */
export function Watch<T extends BaseComponent>(propertyName: string, options: WatchOptions = {}): Function {
  const { deep = false, immediate = false } = options;

  return function decorator(target: T, handler: void) {
    const classOfTarget: any = getClassOfTarget(target);

    if (typeof classOfTarget.__options.watch[propertyName] === 'undefined') {
      classOfTarget.__options.watch[propertyName] = [];
    }

    classOfTarget.__options.watch[propertyName].push({
      handler,
      deep,
      immediate,
    });
  };
}

/**
 * This decorator is wrapper for vue-meta component. Use is similar to vue-meta, but instead of
 * passing the options directly, you can use decorator:
 *
 * @example
 * @Meta()
 * public getMeta(): MetaInfo {
 *   return {
 *     // if no subcomponents specify a metaInfo.title, this title will be used
 *     title: 'Default Title',
 *     // all titles will be injected into this template
 *     titleTemplate: '%s | My Awesome Webapp',
 *   }
 * }
 *
 * @return decorator function
 */
export function Meta<T extends BaseComponent>(): Function {
  return function decorator(target: T, propertyName: string) {
    const classOfTarget: any = getClassOfTarget(target);

    if (typeof classOfTarget.__options.head !== 'undefined') {
      throw new TypeError('Error in @Meta decorator: decorator was used twice in same class.');
    }

    classOfTarget.__options.head = function internalHandler() {
      const instance = this.__instance;
      return instance[propertyName]();
    };
  };
}

/**
 * Decorator of a ref prop
 *
 * Example:
 *
 * class Test {
 *  @Ref() readonly anotherComponent!: AnotherComponent;
 *  @Ref('button') readonly button!: HTMLButtonElement;
 * }
 *
 *
 * @param {String} key name of ref property
 * @returns decorator function
 */
export function Ref<T extends BaseComponent>(key: string): Function {
  return function decorator(target: T) {
    const classOfTarget: any = getClassOfTarget(target);

    classOfTarget.__options.computed = classOfTarget.__options.computed || {};

    classOfTarget.__options.computed[key] = {
      cache: false,
      get(this: Vue) {
        return this.$refs[key];
      },
    };

    Object.defineProperty(target, key, {
      get(): any {
        return (this as any).$vue.$refs[key];
      },
    });
  };
}

type ComponentDef = Component<any, any, any, any> | AsyncComponent<any, any, any, any>;

/**
 * This decorator allows to import external components in BaseComponent instance.
 * All you have to do is to use @Component decorator with argument matching vue
 * component API.
 *
 * @Component({
 *   SomeComponent,
 *   SomeAnotherComponent
 * })
 * class BaseComponent {}
 *
 * @param components object with component definitions
 * @returns decorator function
 */
export function Components<T extends BaseComponent>(components: Record<string, ComponentDef>): Function {
  return function decorator(target: T) {
    const classOfTarget: any = getClassOfTarget(target);
    classOfTarget.__options.components = {
      ...classOfTarget.__options.components,
      ...components,
    };
    return target;
  };
}

@Injectable()
/**
 * This is base component class. All vue components should extend this class.
 */
export class BaseComponent {
  /**
   * Holds internal Vue instance, for accessing $el for example (this.$vue.$el).
   */
  protected $vue!: Vue;

  /**
   * Returns uid
   * @return string
   */
  public get uid(): string {
    return (this.$vue as any).__uid;
  }

  /**
   * Returns Vue instance
   */
  public get vue(): Vue {
    return this.$vue;
  }

  /**
   * Returns array containing this component child components.
   * @return {Array} BaseComponent
   */
  public getChildren(): BaseComponent[] {
    return this.$vue.$children.map((c: any) => c.__instance);
  }

  /**
   * Vue emit event
   * @param {String} eventType name of event to emit
   * @param {Array} args arguments for event
   */
  protected $emit(eventType: string, ...args: any[]): void {
    this.$vue.$emit(eventType, ...args);
  }
}

/**
 * Internal Vue.js hooks lookup table - it will be used to make lifecycle hooks as
 * class methods.
 */
export const $internalHooks = [
  // Life hooks
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'beforeDestroy',
  'destroyed',
  'errorCaptured', // 2.5

  // Vue methods
  'data',
  'render',
  'renderError',

  // Nuxt methods
  'fetch',
  'asyncData',
  'layout',
];

/**
 * This function extracts methods and properties from Component class. It basically fetches
 * data from class and turns it into Vue object literal.
 * @param proto prototype of class, typed as any due to internal magic
 * @param __options all options from vue base component class
 * @returns Vue component
 */
function extractMethodsAndProperties(proto: any, __options: any): Record<string, any> {
  // this is vue options
  const options: any = {};

  // iterate over class properties
  // eslint-disable-next-line complexity
  Object.getOwnPropertyNames(proto).forEach((key) => {
    // ignore constructor
    if (key === 'constructor' || __options.props[key]) {
      return;
    }

    // hooks support - for every function named $mounted, $beforeCreate etc, try to find
    // internal hook in lookup table and make proper entry in vue options object.
    if (key[0] === '$') {
      const internalHook = key.slice(1); // erase the "$"
      if ($internalHooks.includes(internalHook)) {
        // simply save the hook as a function
        options[internalHook] = function hook(this: any, ...args: any[]) {
          if (!this || !this.__instance) {
            return proto[key].call(null, ...args);
          }
          // call the function, passing our component class as "this" instead of Vue instance
          return proto[key].call(this.__instance, ...args);
        };
        return;
      }
    }

    // get property descriptor for this property
    const descriptor = Object.getOwnPropertyDescriptor(proto, key) ?? {};
    if (descriptor.value !== undefined) {
      // if its method, we will save the method under "methods" and
      // rebind this to our component class in place of real Vue instance
      if (typeof descriptor.value === 'function') {
        const method = function methodCode(this: any, ...args: any[]): any {
          return this.__instance[key].call(this.__instance, ...args);
        };
        // save magical method to Vue options object
        (options.methods || (options.methods = {}))[key] = method;
      }
    } else if (descriptor.get || descriptor.set) {
      // if its getter/setter, then we use it as computed properties
      // with computed: { xxx: { set: function(...), get: function(...) } }
      // vue syntax
      options.computed = options.computed || {};

      // transform getter into computed get
      if (descriptor.get !== undefined) {
        options.computed[key] = options.computed[key] || {};
        options.computed[key].get = function getterFunc(this: any) {
          // rebind this to use our class instead of vue instance
          return descriptor.get?.call(this.__instance);
        };
      }

      // transform setter into computed set
      if (descriptor.set !== undefined) {
        options.computed[key] = options.computed[key] || {};
        options.computed[key].set = function setterFunc(this: any, value: any) {
          // rebind this to use our class instead of vue instance
          // eslint-disable-next-line no-unused-expressions
          descriptor.set?.call(this.__instance, value);
        };
      }
    }
  });

  // return vue options
  return options;
}

/**
 * This function collects data from class instance and turns it into real
 * "data" object compatabile with Vue.
 * @param instance instance of class to "vueify"
 * @returns object that should be used in "data()" callback, with initial keys and values
 */
function collectData(instance: any): Record<string, any> {
  // prepare result object
  const resultObject: Record<string, any> = {};

  // hack for blacklisting things from BaseComponent
  const blacklist: string[] = ['$vue'];

  // iterate over instance properties, filtering out blacklisted ones
  Object.getOwnPropertyNames(instance)
    .filter((key) => blacklist.indexOf(key) === -1)
    .forEach((key) => {
      // get initial value and store it in result object
      const initialValue: any = instance[key];
      resultObject[key] = initialValue;

      // define property that will proxy read/write operations to original
      // data object by defining property with get(), set().
      Object.defineProperty(instance, key, {
        configurable: true,
        enumerable: true,
        get: () => resultObject[key],
        set: (value: any) => {
          resultObject[key] = value;
          instance.$vue[key] = resultObject[key];
        },
      });
    });

  // return vue options
  return resultObject;
}

// store last id to make it unique, start from higher numbers on frontend to prevent collisions
let lastId = process.server ? 0 : 0xf000000;

/**
 * Generates unique ID for component. It must guarantee that it wont repeat.
 * @return string with ID
 */
function generateId(): string {
  return `${++lastId % 0xf000000}`;
}

/**
 * Factory function for Vue component. It accepts component class instance with properties,
 * methods, getters, setters and decorators and turns it into raw vue component literal by
 * extracting things from class.
 * @param target class extending BaseComponent
 * @returns vue options object
 */
export function factory(target: typeof BaseComponent): ComponentOptions<any> {
  const classType = getClassOfTarget(target);

  let dataObject: Record<string, any> = {};

  // merge computed properties
  const computed = _merge(
    (classType as any).__options,
    extractMethodsAndProperties(classType.prototype, (classType as any).__options),
  );

  // prepare Vue options object
  const options: ComponentOptions<any> = {
    name: target.name,

    // merge everything from class __options property that is filled by various
    // decorators
    ...computed,

    /**
     * Override serverPrefetch() hook, because we must make some magic to identify
     * components on frontend.
     * @param this this is real Vue instance, passed by framework
     */
    async serverPrefetch(this: any): Promise<void> {
      // call $serverPrefetch() hook if it exists on component
      if (this.__instance.$serverPrefetch) {
        await this.__instance.$serverPrefetch();
      }

      if (this.$ssrContext.nuxt.fetch) {
        // Remove fetch state (Nuxt 2.13.2)
        if (Array.isArray(this.$ssrContext.nuxt.fetch)) {
          // Remove the last added fetch by nuxt serverPrefetch
          this.$ssrContext.nuxt.fetch.pop();
        } else if (typeof this.$ssrContext.nuxt.fetch === 'object') {
          // Remove fetch state (Nuxt 2.15.2)
          delete this.$ssrContext.nuxt.fetch[this.$vnode.context._fetchKey];
        }
      }

      // save component unique ID in vnode to make it appear on final HTML
      // so we can identify it on frontend later
      if (this.$vnode) {
        this.$vnode.data.attrs = {
          ...this.$vnode.data.attrs,
          uid: this.__uid,
        };
      }
    },

    /**
     * Override beforeCreate() hook to make some magic that allows our class components
     * to work
     * @param this this is real Vue instance, passed by framework
     */
    beforeCreate(this: any) {
      // generate unique id for this component: if it has its vnode with "uid" attribute, then
      // use it, otherwise simply generate new one
      this.__uid = this.$vnode?.elm?.getAttribute?.('uid') ?? generateId();

      // IOC container is always saved in Vue root component; here we are going to
      // fetch the container and use it to create instance of our class

      const container: Container = this.$root.$__container || this.$root._provided.$__container;

      // save real vue instance as $vue property in class instance (see BaseComponent class)
      const classInstance = container.resolve(classType) as any;

      classInstance.$vue = this;

      // save our class component instance as __instance field in real Vue component
      this.__instance = classInstance;

      dataObject = collectData(classInstance);

      // prepare class for decorator usage
      initializeDecorators(classInstance, container);

      // prepare class for @Serialize() decorator usage
      const stateSerializer = container.get(StateSerializer);

      if (process.client) {
        stateSerializer.unserializeService(classInstance, stateSerializer.getSerializedState());
      } else {
        // on backend simply add this instance to serializable list, so it will appear serialized on frontend
        stateSerializer.addCustomSerializable(classInstance);
      }
    },

    beforeDestroy(this: any) {
      // get class instance from vue component
      const instance = this.__instance;

      // call original callback
      if (instance.$beforeDestroy) {
        instance.$beforeDestroy();
      }

      // destroy decorators
      destroyDecorators(instance, this.$root.$__container);
    },

    /**
     * Returns Vue component state
     * @returns data object
     */
    data() {
      // returns state data object reference
      return dataObject || {};
    },
  };

  // return prepared vue options
  return options;
}
