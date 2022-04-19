import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class AddressEntity implements DatabaseEntity {

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

  public setPrimaryKey(postalCode: string): AddressEntity {
    this.postalCode = postalCode;
    return this;
  }

  public setPostalCode(postalCode: string): AddressEntity {
    this.postalCode = postalCode;
    return this;
  }

  public setRegion(region: string): AddressEntity {
    this.region = region;
    return this;
  }

  public setCountry(country: string): AddressEntity {
    this.country = country;
    return this;
  }

}
