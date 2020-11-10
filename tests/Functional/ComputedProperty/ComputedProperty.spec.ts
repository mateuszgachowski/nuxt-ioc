/* eslint-disable func-names */
import 'reflect-metadata';
import { Container, StateSerializer } from '../../../lib';

import { Wrapper } from '@vue/test-utils';
import { createWrapper } from '../../Utils/VueUtils';

// @ts-ignore
import ComputedProperty from './ComputedProperty.vue';

describe('[Functional] Computed properties', () => {
  let container: Container;
  let wrapper: Wrapper<any>;

  beforeEach(() => {
    container = new Container();
    container.bind(StateSerializer);
    wrapper = createWrapper(ComputedProperty, container);
  });

  test('returns correct value for computed property', () => {
    expect(wrapper.get('#computedValue').text()).toContain('The computed prop and someClassProp value: 10');
  });

  it('returns correct value for computed property after class prop is changed', async () => {
    await wrapper.get('#button').trigger('click');
    expect(wrapper.get('#computedValue').text()).toContain('The computed prop and someClassProp value: 20');
  });
});
