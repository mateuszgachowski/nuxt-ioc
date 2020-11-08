<template>
  <div>
    THIS WORKS CORRECTLY {{ elo }}
    <button @click="triggerEvent">ClickMe</button>
    <button @click="updateData">Upadte data</button>

    <br />
    {{ thisIsAClassProp }}
    <br />

    <br />

    {{ someClassMethod() }}
    {{ someClassMethod2() }}

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

  @Meta()
  private getMeta(): MetaInfo {
    return {
      title: 'Uno dos tres!',
    };
  }

  private thisIsAClassProp: number = 0;

  private complexObject = {
    test: 1,
    another: 'b',
  };

  public async $fetch(): Promise<void> {
    await this.gMyService.getMyData();
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

  public someClassMethod(): string {
    return 'test';
  }

  public someClassMethod2(): Record<string, any> {
    return this.complexObject;
  }

  public async updateData(): Promise<void> {
    console.log('fire getMyData()');
    await this.gMyService.getMyData();
  }

  @Listen(MyCustomEvent)
  public async handleMyCustomEvent(payload: MyCustomEvent): Promise<void> {
    console.log('EVENT TRIGGERED', payload);
  }
}

export default factory(AnyComponent);
</script>
