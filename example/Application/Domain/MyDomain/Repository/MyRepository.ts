import { Injectable } from '../../../../../';

interface IMyDataResponse {}

@Injectable()
export default class MyRepository {
  public async getMyData(): Promise<IMyDataResponse[]> {
    return Promise.resolve(['some', 'data', 'here']);
  }
}
