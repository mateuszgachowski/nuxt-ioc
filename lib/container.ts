import 'reflect-metadata';
import Container from './System/Container'

const container = new Container();
container.bindInstance(Container, container);

export default container;
