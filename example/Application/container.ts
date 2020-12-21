import { Container, Events, StateSerializer } from '../../';
import MyService from './Domain/MyDomain/Service/MyService';
import MyRepository from './Domain/MyDomain/Repository/MyRepository';
import MySecondService from './Domain/MyDomain/Service/MySecondService';

function createContainer() {
  const container = new Container();
  container.bindInstance(Container, container);

  // System dependencies
  container.bind(Events);
  container.bind(StateSerializer);

  // Application dependencies
  container.bind(MyService);
  container.bind(MySecondService);

  // Repositories
  container.bind(MyRepository);

  return container;
}

export default createContainer;
