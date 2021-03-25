<template>
  <div>
    <fieldset>
      <legend>Component</legend>
      {{ thisIsAClassProp }}
      <br />

      <br />

      <button @click="updateProp">Update number</button>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { Injectable, BaseComponent, factory } from '../../../../../';

@Injectable()
export class PropUpdateComponent extends BaseComponent {
  public thisIsAClassProp: number = 0;

  public updateProp(): void {
    this.thisIsAClassProp += 1;
  }
}

export default factory(PropUpdateComponent);
</script>
