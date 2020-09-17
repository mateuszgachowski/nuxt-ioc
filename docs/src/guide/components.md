# Vue Components syntax

Our solution would not be full if we would not provide a way to create Vue components with Dependency Injection syntax.

To allow this, we have prepared several decoratos and helper functions that will allow to construct Vue components in a full-typed manner.

## Example component

```vue
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

## Adding class dependencies

As you could see in the above example, adding a dependency is very easy and looks like this:

```ts
@Inject(MyService)
private gMyService: MyService;
```
