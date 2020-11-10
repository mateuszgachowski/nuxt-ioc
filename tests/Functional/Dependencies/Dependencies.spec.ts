/* eslint-disable func-names */
import 'reflect-metadata';
import { Container, StateSerializer } from '../../../lib';

import { Wrapper } from '@vue/test-utils';
import { createWrapper } from '../../../tests/Utils/VueUtils';

// @ts-ignore
import Dependencies from './Dependencies.vue';
import AnyDependency from './AnyDependency';

describe('[Functional] Dependencies', () => {
  let container: Container;
  let wrapper: Wrapper<any>;

  beforeEach(() => {
    container = new Container();
    container.bind(StateSerializer);
    container.bind(AnyDependency);
    wrapper = createWrapper(Dependencies, container);
  });

  test('returns correct value from injected dependency', () => {
    expect(wrapper.get('#method').text()).toContain('Returns dependency value: 1');
  });

  it('returns correct value from injected dependency after dep prop changed', async () => {
    await wrapper.get('#button').trigger('click');
    expect(wrapper.get('#method').text()).toContain('Returns dependency value: 10');
  });
});
