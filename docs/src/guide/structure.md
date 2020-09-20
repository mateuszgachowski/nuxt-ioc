# DDD Structure

I this chapter we would like to show you suggested structure approach for creating your application.
As `nuxt-ioc` does not force any structure, you can to do things your way, but if you would like to use some production-proven patterns feel free to build your application using our suggestions.

::: tip
You will see that we are using patterns that are almost identical to DDD approach but due to many simplifications in the implementation there are still strong differences. Keep in mind that we use DDD naming to just explain our approach. If any implementation are not compatible with Eric Evans' approach (and other gurus after him) please forgive us. We are still learning :)
:::

::: warning
DDD is mostly not about software itself but understanding business problems and trying to model these problems using software. `nuxt-ioc` will not solve architectural problems for you, it will only allow you to implement them in easier way.
For strong architecture you should start with [Event Storming](https://en.wikipedia.org/wiki/Event_storming) in the first place.
:::

## File structure

Suggested file structure is following for `nuxt-ioc` projects

```tree{2-30}
.
├── Application
│   ├── Domain
│   │   └── MyDomain
│   │       ├── Component
│   │       │   └── MyComponent.vue
│   │       ├── Event
│   │       │   └── MyCustomEvent.ts
│   │       ├── Repository
│   │       │   └── MyRepository.ts
│   │       ├── Support
│   │       |   ├── MyEnums.ts
│   │       │   └── MyTypes.ts
│   │       └── Service
│   │           └── MyService.ts
│   ├── Utils
│   │   └── Types
│   │       ├── MyGlobalTypes.ts
│   │       └── MyOtherGlobalTypes.ts
│   ├── Test
│   │   └── MyDomain
│   │       ├── Component
│   │       │   └── MyComponent.spec.ts
│   │       ├── Event
│   │       │   └── MyCustomEvent.spec.ts
│   │       ├── Repository
│   │       │   └── MyRepository.spec.ts
│   │       └── Service
│   │           └── MyService.spec.ts
│   └── container.ts
├── node_modules
├── nuxt.config.ts
├── package.json
├── pages
│   └── index.vue
└── tsconfig.json
```

In the above example you can see several patterns that we suggest.

First, a `Application` directory that is placed right in the root dir of your application.

`Application` directory contains of three subdirectories:

- `Domain` - contains your application domains
- `Utils` - contains utils (e.g. global types)
- `Test` - contains unit tests

## Domain directory

Domain directory should contain only domain directories. The only exception is `container.ts` file.

According to DDD approach domains are the real logical/business parts of your architecture. To define them you should use [Event Storming](https://en.wikipedia.org/wiki/Event_storming) but if you are not familiar with ES just try to name them by yourself and what you think will be best.

Keep in mind the [SoC](https://en.wikipedia.org/wiki/Separation_of_concerns) principle - it will help you organize your code even if you do not understand the business domain fully.

In the domain directory (in our example `MyDomain`) we can find further directory splits. As always those are optional and only valid if this particular domain needs an element. Some elements to highlight:

- `Component` - here you can put all .vue components specific to this domain. They could be groupped by other subdirectories
- `Event` - put all domain events here. [More about events can be found here](./event-system).
- `Repository` - contains all domain repositories (logic for accessing the data sources)
- `Service` - contains all services containing your business logic
- `Support` - you can put here files with types, interfaces, enums etc

Optional directories:

- `Config` - if this domain has some configuration class/objects put them here
- `Route` - put all route definitions here that are related to this domain
- `Directives` - if domain requires [Vue directives](https://vuejs.org/v2/guide/custom-directive.html) add them here
- `Strategy` - if your domain has some [strategies](https://refactoring.guru/design-patterns/strategy) put them here

---

::: tip
In some DDD applications you might see structure build from Domain/Infrastructure/Presentation directories. This depends on the complexity of implementation and here we try to keep it simple. If you application requires different structure do not hesitate to change it to your needs.
:::

## Utils directory

Utils directory is ment to contain some global types or enums that are valid throughout all domains. If you do not need this directory then feel free to remove it completely.

## Test directory

Unit tests are ment to be put here. For more information about writing tests for your IOC classes please refer to [testing your app](./testing) section.

::: tip
As you can see `Test` directory is separated from `Domain` directory. In some projects you'll probably see tests put within the source files (side by side). We have tested both approaches and decided to go with separated `Test` directory containing only tests. As always, this is just a suggestion and you can choose by yourself.
:::

## Further read

While creating the domain classess you should keep in mind best programming principles that we will just briefly touch in this book.

- [SOLID](https://en.wikipedia.org/wiki/SOLID), especially SRP
- [CQ(R)S](https://martinfowler.com/bliki/CQRS.html)
- [DDD Aggregates](https://www.martinfowler.com/bliki/DDD_Aggregate.html)
