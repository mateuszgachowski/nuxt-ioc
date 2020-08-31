import { IObservedClass, Serializable } from '../../';

const SERIALIZABLE_KEY = 'key';
const SERIALIZABLE_PROPERTY = 'property';

describe('[Framework][Vue] VueUtil', () => {
  it('should add property to target object', () => {
    const serializable = Serializable(SERIALIZABLE_KEY, { reactive: true });
    const target = {};

    serializable(target, SERIALIZABLE_PROPERTY);

    // eslint-disable-next-line no-prototype-builtins
    expect(target.hasOwnProperty('__observables')).toEqual(true);
  });

  it('should return serializable key and property', () => {
    const serializable = Serializable(SERIALIZABLE_KEY, { reactive: true });
    const target: IObservedClass = {
      __observables: [],
    };

    serializable(target, SERIALIZABLE_PROPERTY);

    expect(target.__observables.length).toEqual(1);
    expect(target.__observables[0].serviceKey).toEqual(SERIALIZABLE_KEY);
    expect(target.__observables[0].propertyName).toEqual(SERIALIZABLE_PROPERTY);
  });
});
