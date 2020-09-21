# Vue Components syntax

Our solution would not be full if we would not provide a way to create Vue components with Dependency Injection syntax.

To allow this, we have prepared several decorators and helper functions that will allow to construct Vue components in a fully-typed manner.

For complete decorators list read [component decorators section](./component-decorators).

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

As you have probably noticed, we do not `export default` the class itself, but put the class through a `factory()` function.
This allows us to have more control over what happens with the class and also provides a way to always reduce the class to simple vue options object. The `factory` function always returns vue `ComponentOptions` object, which looks like this:

```ts
export default {
  data() {
    return {
      myProp: 'hello world',
    };
  },
  methods: {
    myMethod(times) {
      return 1 * times;
    },
  },

  computed: {
    myComputed() {
      return 555;
    },
  },

  // [...]
};
```

This object is build from class properties and method. More or less you can say that:

- Class getters:

```ts
public get myGetter() {}

// becomes =>

{
  computed: {
    myGetter() {}
  }
}
```

- Class methods:

```ts
public myMethod() {}

// becomes =>

{
  methods: {
    myMethod() {}
  }
}
```

- Class props:

```ts
public someProp: string = 'Hello world'

// becomes =>

{
  data() {
    return {
      someProp: 'Hello World',
    }
  }
}
```

## Adding class dependencies

As you could see in the above example, adding a dependency is very easy and looks like this:

```ts
@Inject(MyService)
private gMyService: MyService;
```

::: tip
You can see that class property is named with a `g` prefix. This is just a convention and you can change it to match your style.
However using `g` or any other prefix for external dependencies makes syntax completion easier and more strict.
:::

::: tip
We suggest to always inject dependencies as `private` to prevent accessing them from outside of the component (e.g. child / parent components).
:::

## Vue Lifecycle hook methods

Vue.js has several lifehook methods that are used to interact with the component lifecycle.
When we are using a class-based syntax, default methods could conflict with vue build-in ones. To solve this problem all Vue lifecycle hooks are prefixed with a `$` (dollar) sign.

Currently, following [vue lifehooks](https://vuejs.org/v2/api/#Options-Lifecycle-Hooks) are supported:

- `$beforeCreate`
- `$created`
- `$beforeMount`
- `$mounted`
- `$beforeUpdate`
- `$updated`
- `$activated`
- `$deactivated`
- `$beforeDestroy`
- `$destroyed`
- `$errorCaptured`

With some vue basic methods:

- `$data`
- `$render`
- `$renderError`
- `$emit`

And Nuxt-specific methods:

- `$asyncData` ([documentation](https://nuxtjs.org/guide/async-data))
- `$fetch` ([documentation](https://nuxtjs.org/api/pages-fetch))
- `$layout` ([documentation](https://nuxtjs.org/api/pages-layout))

## Accesing other Vue options

As you can see only lifehooks and some methods are prefixed using `$` (dollar sign).

All other vue options are hidden under `this.$vue` property. If you need to access more advanced options you can easily use it.

Examples:

```ts
public getFirstChild() {
  return this.$vue.$children[0]
}

public getSlots() {
  return this.$vue.$slots;
}

public getElement() {
  return this.$vue.$el;
}
```
