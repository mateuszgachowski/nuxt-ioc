<template>
  <div>THIS WORKS CORRECTLY {{ elo }}</div>
</template>

<script lang="ts">
import { Injectable, BaseComponent, factory, Prop, Meta, Inject, Events, Listen } from '../../../../../';
// import { BaseComponent, factory, Prop, Meta } from '@System/ComponentUtil';
// import Inject from '@System/Inject';
// import Events from '@System/Events';
// import MyCustomEvent from '@Domain/Event/Event/MyCustomEvent';
// import Listen from '@System/Decorator/Listen';
// import SomeService from '@Domain/Event/Service/SomeService';
import MyService from '../Service/MyService';
import { MetaInfo } from 'vue-meta';

@Injectable()
export class AnyComponent extends BaseComponent {
  @Inject(Events)
  private gEvents: Events;

  @Inject(MyService)
  private gMyService: MyService;

  public async $fetch(): Promise<void> {
    await this.gMyService.getMyData();
  }

  public $mounted(): void {
    console.log(this.gMyService.state);
  }

  public get elo(): string {
    return this.gMyService.state.something;
  }
}

export default factory(AnyComponent);
</script>
