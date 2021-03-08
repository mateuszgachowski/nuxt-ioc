/* eslint-disable max-len */
import 'reflect-metadata';
import { VueConstructor } from 'vue';
import { shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { Container } from '../../lib';

export type WrapperFactory = (options?: ThisTypedShallowMountOptions<any>) => Wrapper<any>;

/**
 * Create wrapper factory
 * @param Component component to render wrapper
 * @param container IOC container
 * @return Wrapper Factory function
 */
export function createWrapperFactory(Component: VueConstructor<any>, container: Container): WrapperFactory {
  return (options?: ThisTypedShallowMountOptions<any>) =>
    shallowMount(Component as any, {
      provide: {
        $__container: container,
      },
      ...options,
    });
}

/**
 * Create vue test wrapper
 * @param Component component to render wrapper
 * @param container IOC container
 * @param options object with options to mount
 * @return Vue Wrapper with rendered component
 */
export function createWrapper(
  Component: VueConstructor<any>,
  container: Container,
  options?: ThisTypedShallowMountOptions<any>,
): Wrapper<any> {
  return createWrapperFactory(Component, container)(options);
}
