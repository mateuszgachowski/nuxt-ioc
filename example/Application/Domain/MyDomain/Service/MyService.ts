import { Injectable, Inject, Serializable } from '../../../../../';
import MyRepository from '../Repository/MyRepository';

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
