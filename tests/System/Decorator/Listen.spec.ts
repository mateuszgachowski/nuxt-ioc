import 'reflect-metadata';
import { Listen, Injectable, Container, Events, initializeContainer } from '../../../';

class TestEvent {}

@Injectable()
class Test {
  @Listen(TestEvent)
  public eventHandler() {}
}

describe('Debounce decorator', () => {
  // @ts-ignore
  let container: Container;
  let tester: Test;
  // @ts-ignore
  let gEvents: Events;

  beforeEach(() => {
    // @ts-ignore
    container = new Container();
    container.bind(Events);
    container.bind(Test);

    initializeContainer(container);

    tester = container.get(Test);
    gEvents = container.get(Events);
    jest.spyOn(tester, 'eventHandler');
  });

  it('call handler on event dispatch', async () => {
    gEvents.trigger(TestEvent);

    expect(tester.eventHandler).toHaveBeenCalled();
  });
});
