export const Authentication = (
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>,
): any => {
  Reflect.defineMetadata(propertyKey, {
    ...Reflect.getMetadata(propertyKey, target),
    authentication: true,
  }, target);
};
