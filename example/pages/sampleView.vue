<template>
  <div>
    <fieldset>
      <legend>View</legend>
      {{ thisIsAClassProp }}
      <br />

      <br />

      <button @click="updateProp">Update number</button>
    </fieldset>
    <PropUpdateComponent />
  </div>
</template>

<script lang="ts">
import { Injectable, BaseComponent, factory } from '../..';
import { Components } from '../../src';
import PropUpdateComponent from '../Application/Domain/MyDomain/Component/PropUpdateComponent.vue';

@Injectable()
@Components({
  PropUpdateComponent,
})
export class SampleView extends BaseComponent {
  public thisIsAClassProp: number = 0;

  public updateProp(): void {
    this.thisIsAClassProp += 1;
    this.$vue.$nuxt.refresh();
  }

  public $update() {
    console.log('updated');
  }
}

export default factory(SampleView);
</script>
