import 'reflect-metadata';
import Container from './System/Container';
import Events from './System/Events';
// import { initializeContainer } from './System/Decorators';
import StateSerializer from './System/StateSerializer';

const container = new Container();
container.bindInstance(Container, container);

// System dependencies
container.bind(Events);
container.bind(StateSerializer);

// Application dependencies

// Repositories

export default container;
