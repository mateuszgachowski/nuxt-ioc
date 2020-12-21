<template>
  <div>
    <button @click="someClassProp = someClassProp + 10" id="button">Update value</button>
    <div id="computedValue">{{ computedProperty }}</div>
  </div>
</template>

<script lang="ts">
import { Injectable, BaseComponent, factory, Prop, Meta, Inject, Events, Listen, Components } from '../../../';

@Injectable()
export class ComputedProperty extends BaseComponent {
  private someClassProp: number = 10;

  public get computedProperty(): string {
    return `The computed prop and someClassProp value: ${this.someClassProp}`;
  }
}

export default factory(ComputedProperty);
</script>
