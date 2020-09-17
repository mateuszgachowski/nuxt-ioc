# Component helpers

`nuxt-ioc` comes with several helpful syntactic sugar decorators, that will help keeping your code similar and clean.
Those conventions are optional, but we do recommend using them.

## `Components` decorator

Components decorator is created to inject component dependencies (`.vue` files). This is a known pattern and uses the exact same syntax as default Vue options:

```ts
import { Injectable, Components, BaseComponent } from 'nuxt-ioc';
import MyOtherComponent from './MyOtherComponent.vue';

@Injectable()
@Components({
  MyOtherComponent,
})
export class MyComponent extends BaseComponent {}
```

::: tip
This decorator is not required if you do not have component dependencies. Just do not include it when you do not need it.
:::

## `Prop` decorator

## `RouterParam` decorator

## `RouterQuery` decorator

## `Watch` decorator

## `Meta` decorator

## `Ref` decorator
