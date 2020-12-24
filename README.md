# nuxt-ioc - IOC containers for Vue/Nuxt frameworks

IoC/DI for Nuxt.js framework powered by [Inversify.js](http://inversify.io/) and inspired by great [Java Spring](https://spring.io/) and [Nest.js](https://nestjs.com/) frameworks.

## Requirements

- [Nuxt.js](https://nuxtjs.org/)
- [Vue 2.x](https://vuejs.org/)
- `@nuxt/typescript-build` module [installed](https://typescript.nuxtjs.org/guide/setup.html#installation)

## Quick start

Please refer to our [documentation](https://mateuszgachowski.github.io/nuxt-ioc/) for complete guide.

## Example code

```html
<template>
  <div>My component content</div>
</template>

<script lang="ts">
  import { Injectable, BaseComponent, Inject, factory } from 'nuxt';
  import MyService from '~/Application/MyService';

  @Injectable()
  export class MyComponent extends BaseComponent {
    @Inject(MyService)
    private gMyService: MyService;

    public async $fetch(): Promise<void> {
      await this.gMyService.getMyData();
    }

    public $mounted(): void {
      console.log('this is Vue mounted life hook');
    }
  }

  export default factory(MyComponent);
</script>
```

## Local Test

If you want test our example locally, you need change coreModule ind the index.ts

```javascript
const options = {
  // @ts-ignore
  containerPath: '~/Application/container',
  coreModule: '../../',
  // coreModule: 'nuxt-ioc',
  ...moduleOptions,
};
```
