# Component decorators

`nuxt-ioc` comes with several helpful syntactic sugar decorators, that will help keeping your code uniform and clean.
Those conventions are optional, but **we do recommend using them**.

## `@Components` decorator

`Components` decorator is created to inject component dependencies (`.vue` files). This is a known pattern and uses the exact same syntax as default Vue options:

```ts
import { Injectable, Components, BaseComponent } from 'nuxt-ioc';
import MyOtherComponent from './MyOtherComponent.vue';

@Injectable()
@Components({
  MyOtherComponent,
})
export class MyComponent extends BaseComponent {}
```

The syntax is identical to to [component local registration](https://vuejs.org/v2/guide/components-registration.html#Local-Registration)

::: tip
This decorator is not required if you do not have component dependencies. Just do not include it when you do not need it.
:::

## `@Prop` decorator

`Prop` decorator is responsible for handling component props passing. You can use it to take a vue prop into a class property.

```ts
mport { Injectable, Prop, BaseComponent } from 'nuxt-ioc';

@Injectable()
export class MyComponent extends BaseComponent {
  @Prop()
  private myProp: string;
}
```

For more advanced usage you can pass options to the decorator. It takes options of type `PropOptions` from Vue.js.

```ts
import { Injectable, Prop, BaseComponent } from 'nuxt-ioc';

interface IMyProp {
  test: number;
}

@Injectable()
export class MyComponent extends BaseComponent {
  @Prop({
    type: Object,
    default: () => ({
      test: 1;
    }),
  })
  private myProp: IMyProp;
}
```

For `@Prop` options you can refer to Vue.js [documentation on Props](https://vuejs.org/v2/guide/components-props.html#Prop-Validation)

## `@Ref` decorator

Reference decorator can be used to make a shortcut for vue `$refs` property.

If you create a reference to an DOM element ([see vue docs](https://vuejs.org/v2/api/#ref)) normally its available at `this.$refs.<name>`.

As `nuxt-ioc` adds own layer for vue props (`this.$vue`) accessing refs could be annoying and would look like this:

```ts
this.$vue.$refs.myRef;
```

To simplify this process you can use `@Ref` decorator.

```vue
<template>
  <div>
    <img ref="catPhoto" src="https://placekitten.com/200/300" alt="Cute cats" />
  </div>
</template>
<script lang="ts">
import { Injectable, Ref, BaseComponent } from 'nuxt-ioc';

@Injectable()
export class MyComponent extends BaseComponent {
  @Ref('catPhoto')
  private catPhoto: HTMLElement;

  public $mounted(): void {
    console.log(this.catPhoto); // => shows <img ref="catPhoto" src="https://placekitten.com/200/300" alt="Cute cats" />
  }
}
</script>
```

## `@Watch` decorator

Vue.js allows to watch component data using the `watch: {}` option. For more object-oriented approach you can use `@Watch` decorator for this

```ts
import { Injectable, Watch, BaseComponent } from 'nuxt-ioc';

@Injectable()
export class MyComponent extends BaseComponent {
  @Watch('someVariable', { deep: true, immediate: false })
  public onSomeChange() {
    console.log('value has changed');
  }

  @Watch('otherVariable')
  public onOtherChange() {
    console.log('value has changed');
  }
}
```

**Options**

| Option name  |                        type                        | required | default value |
| ------------ | :------------------------------------------------: | :------: | ------------: |
| propertyName |                       String                       |   yes    |          none |
| options      | [WatchOptions](https://vuejs.org/v2/api/#vm-watch) |    no    |            {} |

## `@Meta` decorator

This decorator helps working with great [vue-meta package](https://vue-meta.nuxtjs.org/). It allows you to decorate a class method with `@Meta` which will automatically pass correct information to the `vue-meta` package.

```ts
import { Injectable, Meta, BaseComponent } from 'nuxt-ioc';

@Injectable()
export class MyComponent extends BaseComponent {
  @Meta()
  public getMeta() {
    return {
      title: 'Default Title',
      titleTemplate: '%s | My Awesome Webapp',
    };
  }
}
```

For info about options that you can pass here refer to [vue-meta documentation](https://vue-meta.nuxtjs.org/guide/metainfo.html)

## `@RouterParam` decorator

This decorator returns router param which is avaiable in `this.$route.params.<name>`.

```ts
import { Injectable, RouterParam, BaseComponent } from 'nuxt-ioc';

@Injectable()
export class MyComponent extends BaseComponent {
  @RouterParam('id')
  private articleUuid: string;

  public $mounted() {
    console.log(`Router param id is: ${this.articleUuid}`);
  }
}
```

If your route is configured like this:

```ts
const router = new VueRouter({
  routes: [{ path: '/article/:id', component: Article }],
});
```

This will get the `id` param to class property that you decorated.

Entering to `/article/ab6kqp1` property `articleUuid` will contain `ab6kqp1` string;

More information about routing can be found on [Vue-router documentation](https://router.vuejs.org/guide/essentials/dynamic-matching.html).

## `@RouterQuery` decorator

`@RouterQuery` works very similar as `@RouterParam` but returns **query params** instead of route params.

```ts
import { Injectable, RouterQuery, BaseComponent } from 'nuxt-ioc';

@Injectable()
export class MyComponent extends BaseComponent {
  @RouterQuery('page')
  private page: string;

  public $mounted() {
    console.log(`Current page is: ${this.page}`);
  }
}
```

If you enter `/article/abc?page=2` property `page` will be filled with query value, which in this case is `2`.
