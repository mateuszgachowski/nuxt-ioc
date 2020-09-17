# Installation

We try to make the installation process as easy as possible, but it still needs a bit more than just `npm install` :)

## Attaching the module

So, first install `nuxt-ioc` package:

```bash
npm i -S nuxt-ioc
```

And then add `nuxt-ioc` to your `modules` inside `nuxt.config.ts`:

```ts{1,6-10,11}
import 'reflect-metadata'; // Import reflect-metadata

module.exports = {
  mode: 'universal',
  buildModules: ['@nuxt/typescript-build'],
  render: {
    bundleRenderer: {
      runInNewContext: false,
    },
  },
  modules: ['nuxt-ioc'], // Add nuxt-ioc package as nuxt module
};
```

## Creating IoC container

At this moment the module is ready, but `nuxt-ioc` requires a `container.ts` to be created which will be used for binding dependencies in your application.

By default, the path of `container.ts` file is following: `~/Application/container.ts`. You can change it in [module settings](./settings.md) if you need to.

So, lets create the required Application structure:

```txt{4}
.
├── Application
│   ├── MyService.ts <-- this is an example service file
│   └── container.ts
└── nuxt.config.ts <-- here is your base nuxt config file
```

The file `container.ts` must export a new container instance, so its content looks like this:

```ts
import { Container } from 'nuxt-ioc';
import MyService from './Domain/MyService';

const container = new Container();

container.bind(MyService); // here we register our sample service

export default container;
```

**Thats it!**

Just for example purposes we will fill `MyService.ts` with some code.

```ts
import { Injectable } from 'nuxt-ioc';

@Injectable()
export default class MyService {}
```
