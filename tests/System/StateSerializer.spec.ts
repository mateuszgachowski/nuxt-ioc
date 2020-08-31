import 'reflect-metadata';
import { Container, Serializable, StateSerializer, Injectable } from '../../';

interface IExampleClassState {
  value: number;
  test: string;
}

const EXAMPLE_STATE_MOCK: IExampleClassState = {
  value: 10,
  test: 'works!',
};

const EXAMPLE_UNSERIALIZED_STATE_MOCK: IExampleClassState = {
  value: 20,
  test: 'works even better!',
};

@Injectable()
class ExampleClass {
  @Serializable('ExampleClass.state')
  public state: IExampleClassState = EXAMPLE_STATE_MOCK;
}

@Injectable()
class ExampleConfictingClass {
  @Serializable('ExampleClass.state') // note the name conflict with previous class
  public state: unknown[] = [];
}

describe('[Framework][System] StateSerializer', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.bind(StateSerializer);
    container.bind(ExampleClass);

    console.log = jest.fn();
    console.error = jest.fn();
  });

  it('should serialize state to front', () => {
    const stateSerializer = container.get(StateSerializer);
    const state = stateSerializer.serialize(container);

    expect(state).toEqual({
      'ExampleClass.state': {
        state: EXAMPLE_STATE_MOCK,
      },
    });
  });

  it('should unserialize state from ssr', () => {
    const stateSerializer = container.get(StateSerializer);
    stateSerializer.unserialize(container, {
      'ExampleClass.state': {
        state: EXAMPLE_UNSERIALIZED_STATE_MOCK,
      },
    });

    const exampleClass = container.get(ExampleClass);
    expect(exampleClass.state).toEqual(EXAMPLE_UNSERIALIZED_STATE_MOCK);
  });

  it('should throw error if service keys are conficting', () => {
    container.bind(ExampleConfictingClass);
    const stateSerializer = container.get(StateSerializer);

    expect(() => {
      stateSerializer.serialize(container);
    }).toThrowError();
  });

  it('should allow to add manual serializable class', () => {
    interface IHackyClassState {
      someOtherValue: string;
    }

    const EXAMPLE_HACKY_CLASS_STATE: IHackyClassState = {
      someOtherValue: 'Ok!',
    };

    @Injectable()
    class SomeHackyClass {
      @Serializable('SomeHackyClass.state')
      public state: IHackyClassState = EXAMPLE_HACKY_CLASS_STATE;
    }

    const stateSerializer = container.get(StateSerializer);
    const hackyInstance = container.resolve(SomeHackyClass);

    stateSerializer.addCustomSerializable(hackyInstance as any);
    const state = stateSerializer.serialize(container);

    expect(state).toEqual({
      'ExampleClass.state': {
        state: EXAMPLE_STATE_MOCK,
      },
      'SomeHackyClass.state': {
        state: EXAMPLE_HACKY_CLASS_STATE,
      },
    });
  });
});
