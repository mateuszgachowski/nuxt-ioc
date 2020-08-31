import { Injectable, Inject, Serializable, Events } from '../../../../../';
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
    if (this.state.something.length > 0) {
      return;
    }

    const myData = await this.gMyRepository.getMyData();

    await this.gEvents.trigger(MyCustomEvent);

    this.state.something = myData;
  }
}
