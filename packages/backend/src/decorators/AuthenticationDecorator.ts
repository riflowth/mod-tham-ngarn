import { RouteUtil } from 'springpress';

export enum Role {
  OFFICER = 'OFFICER',
  TECHNICIAN = 'TECHNICIAN',
  PURCHASING = 'PURCHASING',
  MANAGER = 'MANAGER',
  CEO = 'CEO',
}

export const Authentication = (...role: Role[]) => {
  return RouteUtil.addRouteMetadata({
    authentication: role,
  });
};
