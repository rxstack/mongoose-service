import {Injectable} from 'injection-js';
import {KernelEvents, ExceptionEvent} from '@rxstack/core';
import {Observe} from '@rxstack/async-event-dispatcher';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';

@Injectable()
export class ValidationObserver {
  @Observe(KernelEvents.KERNEL_EXCEPTION)
  async onException(event: ExceptionEvent): Promise<void> {
    if (event.getException().name === 'ValidationError'
      // @ts-ignore
      && typeof event.getException().originalError['errors'] === 'object') {
      const exception = new BadRequestException('Validation Failed');
      exception.data = { errors: [] };
      // @ts-ignore
      _.forEach(event.getException().originalError['errors'], (v: any, key: string) => {
        exception.data.errors.push({
          path: key,
          value: v.value,
          message: v.message
        });
      });
      throw exception;
    }
  }
}
