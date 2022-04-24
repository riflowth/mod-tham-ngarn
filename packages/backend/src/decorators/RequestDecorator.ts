/* eslint-disable func-names */
/* eslint-disable no-param-reassign */

import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { Request } from 'express';

export const RequestBody = (...keys: string[]): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ): any => {
    const method: Function = target[propertyKey];

    descriptor.value = function (...args) {
      const request: Request = args[0];

      if (request.body) {
        keys = keys.filter((key) => !key.startsWith('?'));
        const hasAllRequiredBody = keys.every((key) => request.body[key]);

        if (hasAllRequiredBody) {
          return method.apply(this, args);
        }
      }

      const firstMissingKey = keys.find((key) => !request.body[key]);
      throw new InvalidRequestException(`${firstMissingKey} does not specified in request body`);
    };
  };
};
