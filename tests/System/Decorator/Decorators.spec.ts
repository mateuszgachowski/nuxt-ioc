/* eslint-disable func-names */
import 'reflect-metadata';
import {
  Container,
  Injectable,
  createDecorator,
  initializeContainer,
  BaseDecorator,
  destroyContainer,
} from '../../../';

/**
 * Constants
 */
const TEST_DECORATOR_PARAMS_MOCK = {
  value: 'test',
};

/**
 * This is config object for our test decorator.
 */
interface ITestDecoratorParams {
  value: string;
}

/**
 * This is TestDecoratorClass that executes code.
 */
class TestDecoratorClass extends BaseDecorator<ITestDecoratorParams> {
  public created(): void {}

  public destroyed(): void {}
}

/**
 * This is real decorator which accepts params and returns transformed decorator class to low-level
 * javascript implementation.
 *
 * @param params decorator params
 * @return low-level decorator function
 */
const TestDecorator = function (params: ITestDecoratorParams) {
  // create decorator using class + params
  return createDecorator(TestDecoratorClass, params);
};

/**
 * This is class that we are decorating and testing.
 */
@Injectable()
class TestClass {
  /**
   * This is instance to decorator. This is not a way to use this, but we do not have access to decorator
   * instance in any other way so we just save it in .created() method so we can check various things.
   */
  public decoratorInstance: TestDecoratorClass;

  @TestDecorator(TEST_DECORATOR_PARAMS_MOCK)
  public testMethod(): void {}
}

describe('[Framework][Decorator] Decorators', () => {
  // @ts-ignore
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.bind(TestClass);
  });

  it('should initialize decorator properly', () => {
    // replace "created" function with jest mock
    TestDecoratorClass.prototype.created = jest.fn();

    container.get(TestClass);
    initializeContainer(container);
    expect(TestDecoratorClass.prototype.created).toBeCalled();
  });

  it('should destroy decorator properly', () => {
    // replace "destroyed" function with jest mock
    TestDecoratorClass.prototype.destroyed = jest.fn();

    container.get(TestClass);
    initializeContainer(container);
    destroyContainer(container);
    expect(TestDecoratorClass.prototype.destroyed).toBeCalled();
  });

  it('should pass options to decorator properly', () => {
    // make decorator to store real instance for test
    TestDecoratorClass.prototype.created = function () {
      this.instance.decoratorInstance = this;
    };

    const testClass = container.get(TestClass);
    initializeContainer(container);

    expect(testClass.decoratorInstance.options).toEqual(TEST_DECORATOR_PARAMS_MOCK);
  });

  it('should pass metadata to decorator properly', () => {
    // make decorator to store real instance for test
    TestDecoratorClass.prototype.created = function () {
      this.instance.decoratorInstance = this;
    };

    const testClass = container.get(TestClass);
    initializeContainer(container);

    const { decoratorInstance } = testClass;

    // "descriptor" that should match decorated property descriptor
    expect(decoratorInstance.descriptor).toEqual(Object.getOwnPropertyDescriptor(TestClass.prototype, 'testMethod'));

    // "instance" should match decorated class instance
    expect(decoratorInstance.instance).toEqual(testClass);

    // "propertyName" should match decorated property name
    expect(decoratorInstance.propertyName).toEqual('testMethod');

    // "prototype" should match class prototype
    expect(decoratorInstance.prototype).toEqual(Object.getPrototypeOf(testClass));
  });
});
