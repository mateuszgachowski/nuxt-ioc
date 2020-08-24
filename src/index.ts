// import TestService from './App/TestService';
// import container from './container';

// container.bind(TestService);

// export { container };

export * as Inject from './System/Inject';
export * as Injectable from './System/Injectable';
export * as Container from './System/Container';
export function IOCModule() {
  console.log('MODULE');
}
