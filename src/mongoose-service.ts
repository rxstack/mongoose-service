import {ServiceInterface} from '@rxstack/platform';
import {QueryInterface} from '@rxstack/query-filter';
import {Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface} from '@rxstack/core';
import {MongooseServiceOptions} from './interfaces';
import {Connection, Model} from 'mongoose';

@Injectable()
export class MongooseService<T> implements ServiceInterface<T>, InjectorAwareInterface {

  protected injector: Injector;

  constructor(public options: MongooseServiceOptions) { }

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  async insertOne(data: Object): Promise<T> {
    const result = await this.getModel().create(data);
    return result.toObject();
  }

  async insertMany(data: Object[]): Promise<T[]> {
    const result = await this.getModel().create(data);
    return result.map((item) => item.toObject());
  }

  async updateOne(id: any, data: Object): Promise<void> {
    const modelQuery = this.getModel()
      .findByIdAndUpdate(id, data, {'new': true, 'runValidators': true});
    await modelQuery.lean(true).exec();
  }

  async updateMany(criteria: Object, data: Object): Promise<number> {
    const result = await this.getModel().updateMany(criteria, data).exec();
    return parseInt(result['nModified']);
  }

  async removeOne(id: any): Promise<void> {
    await this.getModel().findByIdAndRemove(id).exec();
  }

  async removeMany(criteria: Object): Promise<number> {
    const result = await this.getModel().deleteMany(criteria).lean(true).exec();
    return parseInt(result['result']['n']);
  }

  async count(criteria?: Object, options?: any): Promise<number> {
    return await this.getModel().find(criteria, null, options).count().exec();
  }

  async find(id: any): Promise<T> {
    return await this.getModel().findById(id).lean(true).exec();
  }

  async findOne(criteria: Object): Promise<T> {
    return await this.getModel().findOne(criteria).lean(true).exec();
  }

  async findMany(query?: QueryInterface): Promise<T[]> {
    const criteria = query && query.where ? query.where : {};
    const modelQuery = this.getModel().find(criteria).lean(true);

    if (query && query.sort) modelQuery.sort(query.sort);
    if (query && query.limit) modelQuery.limit(query.limit);
    if (query && query.skip) modelQuery.skip(query.skip);

    return await modelQuery.lean(true).exec();
  }

  protected getModel(): Model<any> {
    return this.injector.get(Connection).model(this.options.name, this.options.schema, this.options.collection);
  }
}