import { Entity } from '@/entities/Entity';

export class Address implements Entity<Address, string> {

  private postalCode: string;
  private region: string;
  private country: string;

  public getPrimaryKey(): string {
    return this.postalCode;
  }

  public getPostalCode(): string {
    return this.postalCode;
  }

  public getRegion(): string {
    return this.region;
  }

  public getCountry(): string {
    return this.country;
  }

  public setPrimaryKey(postalCode: string): Address {
    this.postalCode = postalCode;
    return this;
  }

  public setPostalCode(postalCode: string): Address {
    this.postalCode = postalCode;
    return this;
  }

  public setRegion(region: string): Address {
    this.region = region;
    return this;
  }

  public setCountry(country: string): Address {
    this.country = country;
    return this;
  }

}
