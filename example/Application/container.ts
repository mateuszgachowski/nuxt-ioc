import { Container, Events, StateSerializer } from '../../';
import MyService from './Domain/MyDomain/Service/MyService';
import MyRepository from './Domain/MyDomain/Repository/MyRepository';

const container = new Container();
container.bindInstance(Container, container);

// System dependencies
container.bind(Events);
container.bind(StateSerializer);

// Application dependencies
container.bind(MyService);

// Repositories
container.bind(MyRepository);

export default container;
