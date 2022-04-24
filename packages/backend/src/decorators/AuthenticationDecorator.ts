export enum Role {
  OFFICER = 'OFFICER',
  TECHNICIAN = 'TECHNICIAN',
  PURCHASING = 'PURCHASING',
  MANAGER = 'MANAGER',
  CEO = 'CEO',
}

export const Authentication = (...role: Role[]) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ): any => {
    Reflect.defineMetadata(propertyKey, {
      ...Reflect.getMetadata(propertyKey, target),
      authentication: role,
    }, target);
  };
};
