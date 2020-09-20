import MyService from '../../../Domain/MyDomain/Service/MyService';
import { Container, Events } from '../../../../../';
import MyRepository from '../../../Domain/MyDomain/Repository/MyRepository';

describe('[MyDomain][Service] MyService', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.bind(MyService);
    container.bind(Events);
    container.bindMock(MyRepository, {
      getMyData: jest.fn(() => Promise.resolve(['some', 'data'])),
    });
  });

  it('should load data to state correcly', async () => {
    const myService = container.get(MyService);

    expect(myService.state).toEqual({ something: [] });

    await myService.getMyData();

    expect(myService.state.something).toEqual(['some', 'data']);
  });
});
