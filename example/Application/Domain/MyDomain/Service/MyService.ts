import { Injectable, Inject, Serializable, Events, Listen } from '../../../../../';
import MyRepository from '../Repository/MyRepository';
import MyCustomEvent from '../Event/MyCustomEvent';

@Injectable()
export default class MyService {
  @Inject(MyRepository)
  private gMyRepository: MyRepository;

  @Inject(Events)
  private gEvents: Events;

  @Serializable('MyService.state')
  public state: Record<string, any> = {
    something: [],
  };

  public async getMyData(): Promise<void> {
    const myData = await this.gMyRepository.getMyData();

    await this.gEvents.trigger(MyCustomEvent);

    this.state.something = myData;
  }

  @Listen(MyCustomEvent)
  public async handleMyCustomEventInService(payload: MyCustomEvent): Promise<void> {
    console.log('[From service] this is fired inside service with an custom event');
  }
}
