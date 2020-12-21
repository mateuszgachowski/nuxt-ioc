/* eslint-disable func-names */
import 'reflect-metadata';
import { Container, StateSerializer } from '../../../lib';

import { Wrapper } from '@vue/test-utils';
import { createWrapper } from '../../Utils/VueUtils';

// @ts-ignore
import Method from './Method.vue';

describe('[Functional] Methods', () => {
  let container: Container;
  let wrapper: Wrapper<any>;

  beforeEach(() => {
    container = new Container();
    container.bind(StateSerializer);
    wrapper = createWrapper(Method, container);
  });

  test('returns correct value for component method', () => {
    expect(wrapper.get('#method').text()).toContain('The method should return sum of classProp and param1: 17');
  });

  it('returns correct value for component method after class prop is changed', async () => {
    await wrapper.get('#button').trigger('click');
    expect(wrapper.get('#method').text()).toContain('The method should return sum of classProp and param1: 27');
  });
});
