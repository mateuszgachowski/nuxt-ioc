# Event system

## Quick guide

If you want to understand how events work in `nuxt-ioc` please skip this quick guide and go to [Introduction section](#introduction).

We suggest to put all the event classes into your domain directories with which they are connected. If the domain event is triggered from "ShoppingCart" domain, the event class should be there too.

Event class:

```ts
// @Domain/MyDomain/Event/SomethingHappenedEvent

export default class SomethingHappenedEvent {
  public eventField: string;
  public actionCount: number;

  // [...] any other fields on event payload you would need
}
```

Publisher:

```ts
// @Domain/MyDomain/Service/MyService

import { Injectable, Inject, Events } from 'nuxt-ioc';
import SomethingHappenedEvent from '@Domain/MyDomain/Event/SomethingHappenedEvent';

@Injectable()
export default class MyService {
  @Inject(Events)
  private gEvents: Events;

  public async someAction(): Promise<void> {
    // Here some action occured that changed the system state
    // this.anything();

    this.gEvents.trigger(SomethingHappenedEvent);
  }
}
```

Subscriber / listener:

```ts
// @Domain/MyDomain/Service/MyOtherService

import { Injectable, Inject, Listen } from 'nuxt-ioc';
import SomethingHappenedEvent from '@Domain/MyDomain/Event/SomethingHappenedEvent';

@Injectable()
export default class MyOtherService {
  @Listen(SomethingHappenedEvent)
  public async reactToEvent(): Promise<void> {
    // react to the event somehow
  }
}
```

## Introduction

Sometimes our system executes an action that is important to other parts of the system. If this is the case there are two ways to go to inform these external systems:

### Command pattern

You inject the other class and fire a method on it. This is called a command pattern.

```ts
import { Injectable, Inject } from 'nuxt-ioc';
import MyRepository from './MyRepository';
import MyOtherService from '@Domani/OtherDomain/MyOtherService';

@Injectable()
export default class MyService {
  @Inject(MyRepository)
  private gMyRepository: MyRepository;

  @Inject(MyOtherService)
  private gMyOtherService: MyOtherService;

  public async someAction(): Promise<void> {
    // Here some action occured that changed the system state
    await this.gMyRepository.fireSomething();

    // Here we send command the other service to do some stuff
    await this.gMyOtherService.triggerSomeAction();
  }
}
```

This seems pretty obvious. But what is wrong with this approach? In fact - nothing.

Command pattern solves problems when one object depends directly on the other, but in some cases you might find yourself in a place, where one class needs to inform many other classes and that's how you create a dependency hell.

::: tip
This is a very simple example and you should read more about [command pattern](https://refactoring.guru/design-patterns/command) on great [refactoring.guru site](https://refactoring.guru/).
:::

Lets imagine dependency hell:

```ts
import { Injectable, Inject } from 'nuxt-ioc';
import MyRepository from './MyRepository';
import MyOtherService from '@Domani/OtherDomain/MyOtherService';
// [...] other imports

@Injectable()
export default class MyService {
  @Inject(MyRepository)
  private gMyRepository: MyRepository;

  @Inject(MyOtherService)
  private gMyOtherService: MyOtherService;

  @Inject(MySecondOtherService)
  private gMySecondOtherService: MySecondOtherService;

  @Inject(MyThirdOtherService)
  private gMyThirdOtherService: MyThirdOtherService;

  @Inject(MyFourthOtherService)
  private gMyFourthOtherService: MyFourthOtherService;

  public async someAction(): Promise<void> {
    // Here some action occured that changed the system state
    await this.gMyRepository.fireSomething();

    // And here we have command hell
    await this.gMyOtherService.triggerSomeAction();
    await this.gMySecondOtherService.triggerSomeAction();
    await this.gMyThirdOtherService.reactToSomeAction();
    await this.gMyFourthOtherService.notifyAboutSomeAction();
  }
}
```

The code above might seem "smelly" to you and you are right. From more science approach you can say that this class has low [cohesion](<https://en.wikipedia.org/wiki/Cohesion_(computer_science)>).

What does it mean? In simple words:

> It means that one method in this class forces this class to depend on several other classes.

As you see, all those dependencies are injected only to fire them in this one, particular method.

You might probably recall programming good practice sentence:

> High cohesion, low coupling

::: tip
To explain cohesion and coupling we can use this great explanation:

**Cohesion** - how closely related everything is with one another.

**Coupling** - how everything is connected to one another.

:::

Now we know this class has low cohesion and high coupling which is the oposite of what we want.

How can we change it then? How to solve our dependency problem?

### Events

To solve our problem we can use [the observer pattern](https://refactoring.guru/design-patterns/observer)

::: tip
You might also recognize this pattern as PubSub, Event Bus or Observer - they are a bit different in implementation but for simplicity of this guide we will leave those differences aside.
:::

Take a look at the code below:

```ts
import { Injectable, Inject, Events } from 'nuxt-ioc';
import MyRepository from './MyRepository';
import SomeActionFiredEvent from '@Domain/MyDomain/Event/SomeActionFiredEvent';

@Injectable()
export default class MyService {
  @Inject(MyRepository)
  private gMyRepository: MyRepository;

  @Inject(Events)
  private gEvents: Events;

  public async someAction(): Promise<void> {
    // Here some action occured that changed the system state
    await this.gMyRepository.fireSomething();

    this.gEvents.trigger(SomeActionFiredEvent);
  }
}
```

We are sending a Domain Event informing that something happened. Any part of the system that should require on this system event can react to it and do its job.

`MyOtherService.ts`, `MySecondOtherService.ts` etc. can react like this

```ts
import { Injectable, Inject, Listen } from 'nuxt-ioc';
import SomeActionFiredEvent from '@Domain/MyDomain/Event/SomeActionFiredEvent';

@Injectable()
export default class MyOtherService {
  @Listen(SomeActionFiredEvent)
  public async triggerSomeAction(): Promise<void> {
    // here we do something after `SomeActionFiredEvent` fired

    this.gEvents.trigger(SomeActionFiredEvent);
  }
}
```

This pattern allows us to clean-up dependency hell from the `publisher` service (`MyService`) and react to this event in other classes e.g.: `MyOtherService`, `MySecondOtherService`, `MyThirdOtherService`, `MyFourthOtherService` etc.

Given classes do not know who is the event sender (`publisher`) but they just know how to react if this event is triggered.

What happened with our cohesion and coupling now? Classes depend only on what they really have to and can communicate using event system.

## Events philosophy

In classic PubSub pattern you would recognise two elements that make a message possible between publisher and subscriber:

1. Message Topic
2. Message itself (payload)

Let's take an example from nice PubSubJS library:

```ts
const mySubscriberCallback = (message) => {
  console.log(message);
};

PubSub.subscribe('MY TOPIC', mySubscriberCallback);

// publish a topic asynchronously
PubSub.publish('MY TOPIC', 'hello world!');
```

You might see that the topic and payload can be whatever you want. By convention many teams decide to use `const values` or `enums` to keep topics clean and without collisions.

```ts
enum Topic {
  FIRST_TOPIC = 'FIRST_TOPIC',
  SECOND_TOPIC = 'SECOND_TOPIC',
}

const mySubscriberCallback = (message) => {
  console.log(message);
};

PubSub.subscribe(Topic.FIRST_TOPIC, mySubscriberCallback);

// publish a topic asynchronously
PubSub.publish(Topic.FIRST_TOPIC, 'hello world!');
```

We can say that this is a good pattern but what about the message payload? Can we make it more structurized, typed maybe? No we can't. But here comes the solution.

If the message is build from TOPIC and MESSAGE where TOPIC should be UNIQUE and MESSAGE should have strict field set you can use a `class`.

```ts
class SomeActionFiredEvent {
  public message: string;
}
```

Hope you are not confused but class contains a unique name (this particular class) and a payload/message which are the class properties.

So how we can use it? Very easy:

```ts
export class SomeActionFiredEvent {
  public message: string;
}

@Injectable()
export default class MyOtherService {
  @Inject(Events)
  private gEvents: Events;

  public async triggerSomeAction(): Promise<void> {
    // here we do something after `SomeActionFiredEvent` fired

    this.gEvents.trigger(SomeActionFiredEvent, {
      message: 'Some string', // this is type-checked
    });
  }

  @Listen(SomeActionFiredEvent)
  public someSubscriber(payload: SomeActionFiredEvent) {
    console.log(payload.message); // this automatically suggest .message field and shows its type (string)
  }
}
```

That's it!

Of course your events may contain more complex types as payload, some examples below:

```ts
enum OptionsToSelect {
  OPTION_ONE,
  OPTION_TWO,
  OPTION_LAST,
}

export class SomeActionFiredEvent {
  public message: string;
  public selectedType: OptionsToSelct;
}
```

::: warning
Even this is a class representation of an Event we do not recommend to create methods on this class, even if this would work. An `Event Class` should only contain class properties, most likely all should be `public`.
:::

## System Events

`nuxt-ioc` provides following, automatically triggered events that informs you about current Nuxt.js state

`BeforeFrontRenderEvent` - triggered just before field serialization
