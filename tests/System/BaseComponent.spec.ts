import { BaseComponent } from '../../';

const MOCK_EMIT = jest.fn();
const MOCK_VUE = {
  __uid: 'uuid',
  $children: [
    {
      getComponentInstance: () => 'MOCK_INSTANCE',
    },
  ],
  $emit: MOCK_EMIT,
};

let baseComponent: BaseComponent;

describe('[Framework][Vue] BaseComponent', () => {
  beforeEach(() => {
    baseComponent = new BaseComponent();
    (baseComponent as any).$vue = MOCK_VUE;
  });

  it('should get id of the component', () => {
    expect(baseComponent.uid).toEqual(MOCK_VUE.__uid);
  });

  it('should get all child components', () => {
    const child = baseComponent.getChildren();
    expect(child.length).toEqual(1);
    expect(child[0]).toEqual(MOCK_VUE.$children[0].getComponentInstance());
  });

  it('should emit new event', () => {
    (baseComponent as any).$emit('customEvent', true);
    expect(MOCK_EMIT).toBeCalledWith('customEvent', true);
  });
});
