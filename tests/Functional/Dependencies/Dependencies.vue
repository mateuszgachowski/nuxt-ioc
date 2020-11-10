<template>
  <div>
    <button @click="updateDependencyOwnValue" id="button">Update value</button>
    <div id="method">{{ sampleMethod() }}</div>
    <div id="computed">{{ sampleComputed }}</div>
  </div>
</template>

<script lang="ts">
import { Injectable, BaseComponent, factory, Prop, Meta, Inject, Events, Listen, Components } from '../../../';
import AnyDependency from './AnyDependency';

@Injectable()
export class Dependencies extends BaseComponent {
  @Inject(AnyDependency)
  private gAnyDependency: AnyDependency;

  public sampleMethod(): string {
    return `Returns dependency value: ${this.gAnyDependency.getOwnValue()}`;
  }

  public get sampleComputed(): string {
    return `Returns computed dependency value: ${this.gAnyDependency.getOwnValue()}`;
  }

  public updateDependencyOwnValue(): void {
    this.gAnyDependency.setOwnValue(10);
  }
}

export default factory(Dependencies);
</script>
