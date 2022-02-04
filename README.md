# The RxStack Mongoose Service

[![Node.js CI](https://github.com/rxstack/mongoose-service/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/rxstack/mongoose-service/actions/workflows/node.js.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/f4b78bc8f5a0dc0d9915/maintainability)](https://codeclimate.com/github/rxstack/mongoose-service/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f4b78bc8f5a0dc0d9915/test_coverage)](https://codeclimate.com/github/rxstack/mongoose-service/test_coverage)

> Mongoose service that implements [@rxstack/platform adapter API and querying syntax](https://github.com/rxstack/rxstack/tree/master/packages/platform#services).

> This adapter also requires a running [MongoDB database server](https://docs.mongodb.com/manual/tutorial/getting-started/#).

## Table of content

- [Installation](#installation)
- [Setup](#setup)
- [Module Options](#module-options)
- [Service Options](#service-options)
- [Usage](#usage)
    - [Create interfaces](#usage-create-interfaces)
    - [Create mongoose schemas](#usage-schemas)
    - [How to use in controller](#usage-controller)
- [Commands](#commands)
    - [Ensure Endexes](#commands-ensure-indexes)
    - [Drop Database](#commands-drop-database)
- [Validation Observer](#validation-observer)


## <a name="installation"></a> Installation

```
npm install @rxstack/mongoose-service --save

// peer depencencies
npm install --no-save @rxstack/core@^0.7 @rxstack/exceptions@^0.6 @rxstack/platform@^0.7 @rxstack/query-filter@^0.6 @rxstack/security@^0.7 @rxstack/async-event-dispatcher@^0.6 @rxstack/service-registry@^0.6 winston@^3.3.3

```

## <a name="setup"></a>  Setup
`MongooseServiceModule` needs to be registered in the `application`. Let's create the application:

```typescript
import {Application, ApplicationOptions} from '@rxstack/core';
import {MongooseServiceModule} from '@rxstack/mongoose-service';

export const APP_OPTIONS: ApplicationOptions = {
  imports: [
    MongooseServiceModule.configure({
      connection: {
        uri: process.env.MONGO_HOST, // mongodb://localhost:27017/test
        // mongoose options
        options: {
          useNewUrlParser: true,
          useCreateIndex: true,
        }
      },
    })
  ],
  providers: [
    // ...
  ]
};

new Application(APP_OPTIONS).start();
```

## <a name="module-options"></a> Module Options

- `connection.url`: mongodb server uri
- `connection.options`: mongoose options (optional)
- `logger.enabled`: enable query logging (defaults to false)
- `logger.level`: logging level (defaults to debug)

## <a name="service-options"></a> Service Options
In addition to [service base options](https://github.com/rxstack/rxstack/tree/master/packages/platform#services-options)
we need to set the following options:

- `model`: [mongoose model](https://mongoosejs.com/docs/models.html)

## <a name="usage"></a>  Usage

### <a name="usage-create-interfaces"></a>  Create interfaces
First we need to create `model interface` and `InjectionToken`:

```typescript
import {InjectionToken} from 'injection-js';
import {MongooseService} from '@rxstack/mongoose-service';

export interface Product {
  id: string;
  name: string;
}

export const PRODUCT_SERVICE = new InjectionToken<MongooseService<Product>>('PRODUCT_SERVICE');
```

### <a name="usage-schemas"></a> Create mongoose schemas

```typescript
import { Schema } from 'mongoose';
const { v4: uuid } = require('uuid');

export const productMongooseSchema = new Schema({
  _id: {
    type: String,
    default: uuid
  },
  name: {
    type: String,
    unique: true,
    required: true,
  }
}, {_id: false, versionKey: false });
```

then register the service in the application provides:

```typescript
import {ApplicationOptions} from '@rxstack/core';
import {MongooseService} from '@rxstack/mongoose-service';
import {Connection} from 'mongoose';

export const APP_OPTIONS: ApplicationOptions = {
  // ...
  providers: [
    {
      provide: PRODUCT_SERVICE,
      useFactory: (conn: Connection) => {
        return new MongooseService({
          idField: '_id', defaultLimit: 25, model: conn.model('Product', productMongooseSchema)
        });
      },
      deps: [Connection],
    },
  ]
};
```

### <a name="usage-controller"></a> How to use in controller


```typescript
import {Connection} from 'mongoose';
import {Injectable} from 'injection-js';
import {Http, Request, Response, WebSocket, InjectorAwareInterface} from '@rxstack/core';

@Injectable()
export class ProductController implements InjectorAwareInterface {

  @Http('POST', '/product', 'app_product_create')
  @WebSocket('app_product_create')
  async createAction(request: Request): Promise<Response> {
    // getting connection
    const connection = injector.get(Connection);
   
    // standard use
    const service = this.injector.get(PRODUCT_SERVICE);
    await service.insertOne(request.body);
  }
}
```

[Read more about platform services](https://github.com/rxstack/rxstack/tree/master/packages/platform#services)

## <a name="commands"></a>  Commands
Helpful commands managing your mongoose database

### <a name="commands-ensure-endexes"></a> Ensure Indexes
Makes the indexes in MongoDB match the indexes defined in this model's schema

```bash
npm run cli mongoose:ensure-indexes
```

### <a name="commands-drop-database"></a> Drop databases
Drop databases, collections and indexes for your documents.

```bash
npm run cli mongoose:drop
```

## <a name="validation-observer"></a>  Validation Observer
`ValidationObserver` converts mongoose errors to `BadRequestException`.

In order to return proper validation errors and status code `400 ` we catch the exception and throw `BadRequestException`.
The error messages can be accessed `exception.data['errors']` and implement [`ValidationError[]`](https://github.com/rxstack/rxstack/tree/master/packages/platform/src).

## License

Licensed under the [MIT license](LICENSE).


