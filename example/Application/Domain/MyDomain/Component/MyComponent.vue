<template>
  <div>THIS WORKS CORRECTLY {{ elo }} <button @click="triggerEvent">ClickMe</button></div>
</template>

<script lang="ts">
import { Injectable, BaseComponent, factory, Prop, Meta, Inject, Events, Listen } from '../../../../../';
import MyService from '../Service/MyService';
import { MetaInfo } from 'vue-meta';
import MyCustomEvent from '../Event/MyCustomEvent';

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

  public async triggerEvent(): Promise<void> {
    await this.gEvents.trigger(MyCustomEvent);
  }

  public get elo(): string {
    return this.gMyService.state.something;
  }

  @Listen(MyCustomEvent)
  public handleMyCustomEvent(payload): void {
    console.log('EVENT TRIGGERED', payload);
  }
}

export default factory(AnyComponent);
</script>
