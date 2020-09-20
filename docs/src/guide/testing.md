# Testing

Automated tests are considered an essential part of any software development that is ment to be long-running.

In this chapter we will focus mainly on unit testing your IOC classes.

::: tip
As you might see `Test` directory is separated from `Domain` directory. In some projects you'll probably see tests put within the source files (side by side). We have tested both approaches and decided to go with separated `Test` directory containing only tests. As always, this is just a suggestion and you can choose by yourself.
:::

## Example unit test

An example test of a service looks like this:

```ts
import { Container } from 'nuxt-ioc';
import MyService from '@Domain/MyDomain/Service/MyService';
import MyRepository from '@Domain/MyDomain/Repository/MyRepository';

describe('[MyDomain][Service] MyService', () => {
  let container: Container;

  // Before each test we mock the container dependencies
  beforeEach(() => {
    container = new Container();
    container.bind(MyService);
    container.bindMock(MyRepository, {
      getMyData: jest.fn(() => Promise.resolve(['some', 'data'])),
    });
  });

  it('should load data to state correcly', async () => {
    // We get the service from container
    const myService = container.get(MyService);

    // First, we can check if the state is empty
    expect(myService.state).toEqual({ something: [] });

    // We command getting the data to state
    await myService.getMyData();

    // We check if the state was populated
    expect(myService.state.something).toEqual(['some', 'data']);
  });
});
```

The test consists of preparation part and actual test part.

If you are testing a class, in the preparation part you should decide which dependencies you bind in their real form, and which you mock. In the above example you can see that we've mocked repository, as in our unit test we do not want to test data-fetching at all. The mocked class method will always return an array containing two elements `['some', 'data']`.

Because before every test the container is recreated from the scratch, in each test we need to get the service from container. This is as simple as calling `container.get(MyService)`.

Lets assume our **Service** looks like this:

```ts
import { Injectable, Inject } from 'nuxt-ioc';
import MyRepository from '../Repository/MyRepository';

@Injectable()
export default class MyService {
  @Inject(MyRepository)
  private gMyRepository: MyRepository;

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

and our **Repository** like this:

```ts
import { Injectable } from 'nuxt-ioc';

interface IMyDataResponse {}

@Injectable()
export default class MyRepository {
  public async getMyData(): Promise<IMyDataResponse[]> {
    const response = await fetch('https://myapi.com/endpoint/123');

    return await response.json();
  }
}
```

So, calling the `getMyData` method we will automatically fire a full HTTP request from the `MyRepository` class. To avoid that, we used `bindMock` which allows you to mock particular method in the dependent class to whatever you want.

In our case we mocked it to return a static array with two elements.

Now, testing the `MyService.getMyData` method we do not unit test fetching logic which is correct, as unit tests should only focus on one layer of code and, if possible, should not leak between layers.

::: warning
Above example is just to explain unit testing. The final service class should support error catching and setting the correct state in case of request failure but for code simplicity this was omitted.
:::

## Container methods

As in the previous example you can use some helper methods on the Container class. Those are:

- `Container.bind(classKey, implementation)` - binds particular class (abstract or concrete) into class implementation. As a key you can pass either direct implementation or an abstract class. If second argument is not passed, class passed will be both bind key and implementation. Use this to bind class without any changes in unit tests.

- `Container.bindInstance(classKey, instance)` - binds particular class to an existing class instance. You can use this to share single class instance between two or more containers.

- `Container.bindMock(classKey, implementation)` - binds mocked instance to a particular class. This can be used to mock classes in unit tests. It allows it to be a partial class mock.
