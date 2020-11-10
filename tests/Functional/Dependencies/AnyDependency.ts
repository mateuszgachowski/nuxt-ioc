import { Injectable } from '../../../lib';

@Injectable()
// @ts-ignore
export default class AnyDependency {
  private dependencyValue: number = 1;

  public getOwnValue(): number {
    return this.dependencyValue;
  }

  public setOwnValue(newValue: number) {
    this.dependencyValue = newValue;
  }
}
