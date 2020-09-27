# Data serialization

## Introduction

::: tip
If you are not using SSR (only SPA) you can skip that guide
:::

Due to [SSR](https://ssr.vuejs.org/) specificity some data must be serialized to NUXT_STATE so that it could be loaded synchronously on front-end side to proceed with [hydration](https://ssr.vuejs.org/guide/hydration.html)

Nuxt.js by itself creates w global variable in window called `window.__NUXT__` where it passes serialized data from backend to frontend.

To allow your custom services to be serialized, `nuxt-ioc` injects its own serialized data into this variable so that it could be accessed on front-end side and unserialize to services back again.
To do this, we use `beforeNuxtRender` hook and inject data into `__NUXT__.iocState`.

## Services with serialized data

To create a service with serialized state field you just need to decorate the `state` property. Everything else is held by `nuxt-ioc` (serialization, deserialization, class instantiation etc.)

```ts
import { Injectable, Inject, Serializable } from 'nuxt-ioc';
import MyRepository from '../Repository/MyRepository';
import MyCustomEvent from '../Event/MyCustomEvent';

@Injectable()
export default class MyService {
  @Inject(MyRepository)
  private gMyRepository: MyRepository;

  @Serializable('MyService.state')
  public state: Record<string, any> = {
    something: [],
  };

  public async getMyData(): Promise<void> {
    if (this.state.something.length > 0) {
      return;
    }

    const myData = await this.gMyRepository.getMyData();

    this.state.something = myData;
  }
}
```

As you can see, your state property should be called exactly `state` and you just decorate it with `@Serializable()` decorator. As decorator argument you must pass its unique key - we suggest following pattern:

```
<ClassName>.state
```

or for more complex systems:

```
<DomainName>:<ClassName>.state
```

After decorating the property it will be automatically serialized to NUXT state and deserialized before the application hydrates on front-end.

::: warning
It is very important that the rendered state on SSR and on front-end use the same set of data. If some conflicts are detected Vue will fail the hydration and throw warnings (or errors in PRODUCTION mode). That is why data serialization is so important when using server side rendered content.
:::
