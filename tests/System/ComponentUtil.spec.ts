/* eslint-disable new-cap */
import {
  BaseComponent,
  Components,
  factory,
  Prop,
  Ref,
  Watch,
  Meta,
  $internalHooks,
  RouterParam,
  RouterQuery,
  Container,
  StateSerializer,
  Serializable,
} from '../../';
import { ComponentOptions } from 'vue';

const PROP_OPTIONS = { type: String, required: true, default: 'Property' };
const WATCH_OPTIONS = { deep: true, immediate: true };
const spyOnResult = jest.fn();

// Vue blacklist hooks. The factory function override this hooks
const blackListHooks = ['data', 'beforeCreate', 'beforeDestroy', 'fetch'];

interface IPropInterface {
  type: string;
}

class ChildComponent extends BaseComponent {}

const childComponent = factory(ChildComponent);

@Components({
  childComponent,
})
class ParentComponent extends BaseComponent {
  @Prop(PROP_OPTIONS)
  private prop: string;

  @Prop()
  private propInterface: IPropInterface;

  private variable: number = 2;

  private numberProp: number = 0;

  @Ref('form')
  private formRef: any;

  @RouterParam()
  private testparam: string;

  @RouterParam()
  private params: any;

  @RouterParam('test')
  private paramByArgument: string;

  @RouterQuery()
  private testquery: string;

  @RouterQuery()
  private query: string[];

  @RouterQuery('test')
  private queryByArgument: string;

  @Serializable('ParentComponent.someSerializable')
  private someSerializable: string;

  public sixHundred: number = 600;

  @Watch('value', WATCH_OPTIONS)
  public watchHandler(): void {
    spyOnResult('watchHandler');
  }

  @Meta()
  public getMeta(): unknown {
    return {
      title: `Hello world ${this.sixHundred}!`,
    };
  }

  public get variableGetter(): number {
    return this.variable;
  }

  public set variableGetter(newValue: number) {
    this.variable = newValue;
  }

  public customMethod(): void {
    spyOnResult('customMethod');
  }

  public methodToUpdateProp(): void {
    this.numberProp += 1;
  }

  /**
   * Lifecycle hooks
   */
  public $created(): void {
    spyOnResult('created');
  }

  public $beforeMount(): void {
    spyOnResult('beforeMount');
  }

  public $mounted(): void {
    spyOnResult('mounted');
  }

  public $destroyed(): void {
    spyOnResult('destroyed');
  }

  public $beforeUpdate(): void {
    spyOnResult('beforeUpdate');
  }

  public $updated(): void {
    spyOnResult('updated');
  }

  public $activated(): void {
    spyOnResult('activated');
  }

  public $deactivated(): void {
    spyOnResult('deactivated');
  }

  public $render(): void {
    spyOnResult('render');
  }

  public $renderError(): void {
    spyOnResult('renderError');
  }

  public $errorCaptured(): void {
    spyOnResult('errorCaptured');
  }

  public $fetch(): void {
    spyOnResult('fetch');
  }

  public $asyncData(): void {
    spyOnResult('asyncData');
  }

  public $layout(): void {
    spyOnResult('layout');
  }

  public async $serverPrefetch(): Promise<void> {
    spyOnResult('serverPrefetch');
  }
}

let container: Container;

const mockedContainer = new Container();

const MOCK_INSTANCE = {
  $root: {
    __container: mockedContainer,
  },
  $refs: {
    form: 'form',
  },
  $props: {
    prop: 'test',
  },
  $vnode: {
    data: {
      attrs: {},
    },
  },
  $route: {},
  __instance: {},
};

describe('[Framework][Vue] ComponentUtil', () => {
  let target: ComponentOptions<any>;

  const getNewMockInstance = (params: any) => ({ ...MOCK_INSTANCE, ...params });
  const getWrapper = (mockInstance = MOCK_INSTANCE) => {
    const wrapper = factory(ParentComponent);
    (wrapper as any).beforeCreate.call(mockInstance);

    return wrapper;
  };

  beforeEach(() => {
    container = new Container();
    container.bind(StateSerializer);

    // mock Container::resolve() as its used here and there in tests
    container.resolve = jest.fn((classType) => new classType());

    // assign container to vue "root instance"
    MOCK_INSTANCE.$root.__container = container;
    target = getWrapper();
  });

  it('[Prop] should have props defined', () => {
    const props = target.props as any;

    expect(props.prop).toBeDefined();
    expect(props.propInterface).toBeDefined();
    expect(props.prop).toEqual(PROP_OPTIONS);
    expect(props.propInterface).toEqual({ type: Object });
    expect((MOCK_INSTANCE as any).__instance.prop).toEqual(MOCK_INSTANCE.$props.prop);
  });

  describe('[RouterParam]', () => {
    const testparam1 = 'testparam1';
    const testparam2 = 'testparam2';

    const testParams = (params: any, paramName: string, expectations: any) => {
      const CURRENT_MOCK_INSTANCE = getNewMockInstance({ $route: { params } });
      const wrapper = getWrapper(CURRENT_MOCK_INSTANCE);
      const {
        computed: { [paramName]: paramData },
      } = wrapper as any;
      expect(paramData.get.call(CURRENT_MOCK_INSTANCE)).toBe(expectations);
    };

    it('should have no params', () => {
      const {
        computed: { testparam },
      } = target as any;
      expect(testparam.get.call(MOCK_INSTANCE)).toBe('');
    });

    it('should have correct param', () => {
      const params = { testparam: testparam1 };
      testParams(params, 'testparam', testparam1);
    });

    it('should returns all params', () => {
      const params = { testparam1, testparam2 };
      testParams(params, 'params', params);
    });

    it('should returns param by decorator argument', () => {
      const params = { test: testparam1 };
      testParams(params, 'paramByArgument', testparam1);
    });
  });

  describe('[RouterQuery]', () => {
    const testQuery1 = 'testQuery1';
    const testQuery2 = 'testQuery2';

    const testQuery = (query: any, queryName: string, expectations: any) => {
      const CURRENT_MOCK_INSTANCE = getNewMockInstance({ $route: { query } });
      const wrapper = getWrapper(CURRENT_MOCK_INSTANCE);
      const {
        computed: { [queryName]: paramData },
      } = wrapper as any;
      expect(paramData.get.call(CURRENT_MOCK_INSTANCE)).toBe(expectations);
    };

    it('should have no query', () => {
      const {
        computed: { testquery },
      } = target as any;
      expect(testquery.get.call(MOCK_INSTANCE)).toBe('');
    });

    it('should have correct query', () => {
      const query = { testquery: testQuery1 };
      testQuery(query, 'testquery', testQuery1);
    });

    it('should returns all params', () => {
      const query = { testQuery1, testQuery2 };
      testQuery(query, 'query', query);
    });

    it('should returns param by decorator argument', () => {
      const query = { test: testQuery1 };
      testQuery(query, 'queryByArgument', testQuery1);
    });
  });

  it('[Computed] should have computed property defined', () => {
    const computed = target.computed as any;

    expect(computed?.hasOwnProperty('variableGetter')).toEqual(true);
    expect(computed.variableGetter?.hasOwnProperty('get')).toEqual(true);
    expect(computed.variableGetter?.hasOwnProperty('set')).toEqual(true);
    expect(computed.variableGetter.get.call(MOCK_INSTANCE)).toEqual(2);
  });

  it('[Refs] should have references defined', () => {
    const computed = target.computed as any;

    expect(computed?.hasOwnProperty('form')).toEqual(true);
    expect(computed.form?.hasOwnProperty('cache')).toEqual(true);
    expect(computed.form.cache).toEqual(false);
    expect(computed.form?.hasOwnProperty('get')).toEqual(true);
    expect(computed.form.get.call(MOCK_INSTANCE)).toEqual(MOCK_INSTANCE.$refs.form);
  });

  it('[Lifecycle] should call all lifecycle hooks', () => {
    $internalHooks.forEach((internalHook) => {
      // check if all hooks has been called
      // @ts-ignore
      const spyOn = jest.spyOn(target, internalHook);
      (target as any)[internalHook].call(MOCK_INSTANCE);
      expect(spyOn).toBeCalled();

      // This hook are override inside of the factory function
      if (!blackListHooks.includes(internalHook)) {
        expect(spyOnResult).toHaveBeenCalledWith(internalHook);
      }
    });
  });

  it('[Methods] should call all defined methods', () => {
    expect(target.methods?.hasOwnProperty('customMethod')).toEqual(true);
    (target.methods as any).customMethod.call(MOCK_INSTANCE);
    expect(spyOnResult).toHaveBeenCalledWith('customMethod');
  });

  it('[Watch] should have watch method defined', () => {
    const watches = target.watch;
    const valueWatch = watches?.value as any;

    expect(watches?.hasOwnProperty('value')).toEqual(true);
    expect(valueWatch.length).toEqual(1);
    expect(valueWatch[0]).toEqual({ handler: 'watchHandler', ...WATCH_OPTIONS });
    (target.methods as any).watchHandler.call(MOCK_INSTANCE);
    expect(spyOnResult).toHaveBeenCalledWith('watchHandler');
  });

  it('[Meta] should add head function', () => {
    expect(typeof (target as any).head).toEqual('function');
  });

  it('[Meta] should allow to use class props', () => {
    const computedInfo = (target as any).head.call(MOCK_INSTANCE);
    expect(computedInfo).toEqual({
      title: 'Hello world 600!',
    });
  });

  it('[Data] should have variables set from class', () => {
    const data = (target as any).data();

    expect(data?.hasOwnProperty('variable')).toEqual(true);
    expect((data as any).variable).toBeDefined();
    expect((data as any).variable).toEqual(2);
  });

  it('[Data] should update prop in template', () => {
    const data = (target as any).data();

    expect(data?.hasOwnProperty('numberProp')).toEqual(true);
    expect((data as any).numberProp).toBeDefined();
    expect((data as any).numberProp).toEqual(0);

    (target.methods as any).methodToUpdateProp.call(MOCK_INSTANCE);

    expect((data as any).numberProp).toEqual(1);
  });

  it('[ServerPrefetch] should call method', () => {
    (target as any).serverPrefetch.call(MOCK_INSTANCE);
    expect(spyOnResult).toBeCalledWith('serverPrefetch');
  });

  xit('should unserialize service on front', () => {
    const stateSerializer = container.get(StateSerializer);
    const spyOn = jest.spyOn(stateSerializer, 'unserializeService');
    (target as any).beforeCreate.call(MOCK_INSTANCE);

    expect(spyOn).toHaveBeenCalled();
  });
});
