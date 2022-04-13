export class Address {

  private readonly postalCode: string;
  private region: string;
  private country: string;

  public constructor(postalCode: string) {
    this.postalCode = postalCode;
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

  public setRegion(region: string): Address {
    this.region = region;
    return this;
  }

  public setCountry(country: string): Address {
    this.country = country;
    return this;
  }

}
