import { Methods } from '@/controllers/Route';

export const RouteMapping = (path: string, method: Methods): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ): any => {
    Reflect.defineMetadata(propertyKey, {
      ...Reflect.getMetadata(propertyKey, target),
      path,
      method,
    }, target);
  };
};
