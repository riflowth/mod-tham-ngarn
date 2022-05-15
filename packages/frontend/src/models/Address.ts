import { Entity } from './Entity';

export interface Address extends Entity {

  postalCode: string;
  region: string;
  country: string;

}
