<template>
  <div>
    <button @click="someClassProp = someClassProp + 10" id="button">Update value</button>
    <div id="method">{{ sampleMethod(7) }}</div>
  </div>
</template>

<script lang="ts">
import { Injectable, BaseComponent, factory, Prop, Meta, Inject, Events, Listen, Components } from '../../../';

@Injectable()
export class Method extends BaseComponent {
  private someClassProp: number = 10;

  public sampleMethod(param1: string): string {
    return `The method should return sum of classProp and param1: ${this.someClassProp + param1}`;
  }
}

export default factory(Method);
</script>
