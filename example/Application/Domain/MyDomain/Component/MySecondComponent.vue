<template>
  <div>THIS WORKS CORRECTLY TOO {{ elo }}</div>
</template>

<script lang="ts">
import { Injectable, BaseComponent, factory, Prop, Meta, Inject, Events, Listen } from '../../../../../';
import MySecondService from '../Service/MySecondService';
import { MetaInfo } from 'vue-meta';
import MyCustomEvent from '../Event/MyCustomEvent';

@Injectable()
export class MySecondComponent extends BaseComponent {
  @Inject(Events)
  private gEvents: Events;

  @Inject(MySecondService)
  private gMySecondService: MySecondService;

  public get elo(): string {
    return this.gMySecondService.state.something;
  }
}

export default factory(MySecondComponent);
</script>
