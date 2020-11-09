import { Injectable, Inject, Serializable, Events, Listen } from '../../../../../';
import MyRepository from '../Repository/MyRepository';
import MyCustomEvent from '../Event/MyCustomEvent';

@Injectable()
export default class MySecondService {
  @Inject(MyRepository)
  private gMyRepository: MyRepository;

  @Serializable('MySecondService.state')
  public state: Record<string, any> = {
    something: [],
  };

  @Listen(MyCustomEvent)
  public async getMySecondData(): Promise<void> {
    const myData = await this.gMyRepository.getMyData();

    this.state.something = myData;
  }
}
