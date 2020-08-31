import { Injectable } from '../../../../../';

interface IMyDataResponse {}

@Injectable()
export default class MyRepository {
  public async getMyData(): Promise<IMyDataResponse[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(['some', 'data', 'here']), 2000);
    });
  }
}
