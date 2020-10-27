<template>
  <div>
    THIS WORKS CORRECTLY {{ elo }}
    <button @click="triggerEvent">ClickMe</button>

    <br>
    {{ thisIsAClassProp }}
    </br>

    <button @click="updateProp">Update number</button>
  </div>
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

  private thisIsAClassProp: number = 0;

  public async $fetch(): Promise<void> {
    await this.gMyService.getMyData();
  }

  public $mounted(): void {
    console.log(this.gMyService.state);
  }

  public updateProp(): void {
    this.thisIsAClassProp += 1;
  }

  public async triggerEvent(): Promise<void> {
    await this.gEvents.trigger(MyCustomEvent);
  }

  public get elo(): string {
    return this.gMyService.state.something;
  }

  @Listen(MyCustomEvent)
  public handleMyCustomEvent(payload: MyCustomEvent): void {
    console.log('EVENT TRIGGERED', payload);
  }
}

export default factory(AnyComponent);
</script>
