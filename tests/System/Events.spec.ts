import 'reflect-metadata';
import { Container, Events } from '../../';

describe('[Framework][System] Events', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.bind(Events);
  });

  it('should allow to listen on event, trigger it and have listener called', async () => {
    class TestEvent {}
    const testEventListener = jest.fn();

    const events = container.get(Events);
    events.on(TestEvent, testEventListener);
    await events.trigger(TestEvent);

    expect(testEventListener).toBeCalled();
  });

  it('should allow multiple listeners for event and have them called', async () => {
    class TestEvent {}
    const testEventListeners = [jest.fn(), jest.fn(), jest.fn()];

    const events = container.get(Events);
    testEventListeners.forEach((listener) => events.on(TestEvent, listener));
    await events.trigger(TestEvent);

    testEventListeners.forEach((listener) => expect(listener).toBeCalled());
  });

  it('should allow multiple triggering of single event', async () => {
    class TestEvent {}
    const testEventListener = jest.fn();

    const events = container.get(Events);
    events.on(TestEvent, testEventListener);

    const triggers = new Array(5).fill(0).map(() => events.trigger(TestEvent));
    await Promise.all(triggers);

    expect(testEventListener).toBeCalledTimes(5);
  });

  it('should allow to pass payload in event and receive it on listener', () => {
    class TestEventWithPayload {
      public value: number;
    }

    let savedPayload: TestEventWithPayload = null!;

    const testEventListener = jest.fn((payload) => {
      savedPayload = payload;
    });

    const events = container.get(Events);
    events.on(TestEventWithPayload, testEventListener);
    events.trigger(TestEventWithPayload, {
      value: 42,
    });

    expect(testEventListener).toBeCalledWith({ value: 42 });
    expect(savedPayload).toBeInstanceOf(TestEventWithPayload);
  });

  it('should allow to await until all async listeners are done', async () => {
    // expect  one assertion
    expect.assertions(2);

    // some value that will be updated asynchronously
    let someValue: number = 0;

    // asynchronous event listener function that updates value after minor delay
    const asyncListenerFunction = (): Promise<void> =>
      new Promise((resolve) => {
        // after 0.1s, set someValue as 10
        setTimeout(() => {
          someValue = 10;
          resolve();
        }, 10);
      });

    class TestEvent {}
    const testEventListener = jest.fn(asyncListenerFunction);

    const events = container.get(Events);
    events.on(TestEvent, testEventListener);

    expect(someValue).toEqual(0);
    await events.trigger(TestEvent); // await until all async listeners are triggered
    expect(someValue).toEqual(10); // it should wait minor timeout before leaving trigger()
  });

  it('should allow to remove event listener', async () => {
    expect.assertions(1);

    class TestEvent {}
    const testEventListener = jest.fn();

    const events = container.get(Events);
    const listenerId = events.on(TestEvent, testEventListener); // store id to remove later
    events.off(listenerId); // remove listener

    await events.trigger(TestEvent); // trigger the event
    expect(testEventListener).not.toBeCalled();
  });

  it('should throw error if try to remove non-existing event listener', () => {
    class TestEvent {}

    const events = container.get(Events);
    const listenerId = events.on(TestEvent, () => {});

    // remove it for the first time
    events.off(listenerId);

    // remove it for the second time
    expect(() => {
      events.off(listenerId);
    }).toThrowError();
  });

  it('should allow waiting for event to be triggered', async () => {
    // expect two assertions
    expect.assertions(2);

    // some value that will be updated asynchronously
    let someValue: number = 0;

    // test event class
    class TestEvent {}

    // get events from container
    const events = container.get(Events);

    // asynchronously trigger the event after minor timeout
    setTimeout(() => {
      someValue = 10;
      events.trigger(TestEvent);
    }, 10);

    // before waiting, expect the value to equal 0
    expect(someValue).toEqual(0);

    // make waitFor() call to await until event is triggered
    await events.waitFor(TestEvent, null);

    // if waitFor() really waited, then someValue will have value 10 instead of 0
    expect(someValue).toEqual(10);
  });

  it('should throw when timeout is exceeded and event was not called', (done) => {
    // expect 1 assertions
    expect.assertions(1);

    // test event class
    class TestEvent {}

    // get events from container
    const events = container.get(Events);

    // make waitFor() call with timeout
    events
      .waitFor(TestEvent, 10)
      .then(() => {
        done();
      })
      .catch((err) => {
        expect(err).not.toBeNull();
        done();
      });
  });

  it('should call two triggers if two waitFor() are used on same event', async () => {
    class TestEvent {}

    // get events from container
    const events = container.get(Events);
    let method1Done = false;
    let method2Done = false;

    async function someMethod1() {
      await events.waitFor(TestEvent);
      method1Done = true;
    }

    async function someMethod2() {
      await events.waitFor(TestEvent);
      method2Done = true;
    }

    someMethod1();
    someMethod2();

    await events.trigger(TestEvent);

    expect(method1Done).toBe(true);
    expect(method2Done).toBe(true);
  });
});
