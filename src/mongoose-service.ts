import {ServiceInterface} from '@rxstack/platform';
import {QueryInterface} from '@rxstack/query-filter';
import {Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface} from '@rxstack/core';
import {MongooseServiceOptions} from './interfaces';
import {Model} from 'mongoose';

@Injectable()
export class MongooseService<T> implements ServiceInterface<T>, InjectorAwareInterface {

  protected injector: Injector;

  constructor(public options: MongooseServiceOptions) { }

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  async insertOne(data: Object, options?: any): Promise<T> {
    const result = await this.getModel().create(data);
    return result.toObject();
  }

  async insertMany(data: Object[], options?: any): Promise<T[]> {
    const result = await this.getModel().create(data, options);
    return result.map((item: any) => item.toObject());
  }

  async updateOne(id: any, data: Object, options?: any): Promise<void> {
    const modelQuery = this.getModel().updateOne({[this.options.idField]: id}, data, Object.assign(
      { 'new': true, runValidators: true }, options
    ));
    await modelQuery.lean(true).exec();
  }

  async updateMany(criteria: Object, data: Object, options?: any): Promise<number> {
    const result = await this.getModel().updateMany(criteria, data, Object.assign(
      { runValidators: true }, options
    )).exec();
    return result.nModified;
  }

  async removeOne(id: any): Promise<void> {
    await this.getModel().deleteOne({[this.options.idField]: id}).exec();
  }

  async removeMany(criteria: Object): Promise<number> {
    const result = await this.getModel().deleteMany(criteria).lean(true).exec();
    return result.deletedCount;
  }

  async count(criteria?: Object, options?: any): Promise<number> {
    return await this.getModel().countDocuments(criteria).exec();
  }

  async find(id: any, options?: any): Promise<T> {
    return await this.findOne({[this.options.idField]: id});
  }

  async findOne(criteria: Object, options?: any): Promise<T> {
    return await this.getModel().findOne(criteria, this.getProjection(options), options).lean(true).exec();
  }

  async findMany(query?: QueryInterface, options?: any): Promise<T[]> {
    query = Object.assign({where: {}, limit: this.options.defaultLimit, skip: 0, sort: null}, query);
    const modelQuery = this.getModel().find(query.where, this.getProjection(options), options);
    modelQuery.sort(query.sort);
    modelQuery.limit(query.limit);
    modelQuery.skip(query.skip);
    return await modelQuery.lean(true).exec();
  }

  protected getModel(): Model<any> {
    return this.options.model;
  }

  private getProjection(options: any): Object {
    if (options && options['projection']) {
      const projection = options['projection'];
      delete options['projection'];
      return projection;
    }
  }
}
