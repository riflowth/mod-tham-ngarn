export type SameSiteCookieOption = 'Lax' | 'Strict' | 'None';

export type CookieOptions = {
  expiryDate?: Date,
  httpOnly?: boolean,
  domain?: string,
  path?: string,
  sameSite?: SameSiteCookieOption,
};

export class Cookie {

  private name: string;
  private value: string;
  private expiryDate: Date;
  private httpOnly: boolean;
  private domain: string;
  private path: string;
  private sameSite: SameSiteCookieOption;

  public constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public getExpiryDate(): Date {
    return this.expiryDate;
  }

  public setExpiryDate(expiryDate: Date): void {
    this.expiryDate = expiryDate;
  }

  public getMaxAge(): number {
    return this.expiryDate.getTime() - Date.now();
  }

  public setMaxAge(milliseconds: number): void {
    this.expiryDate = new Date(Date.now() + milliseconds);
  }

  public getHttpOnly(): boolean {
    return this.httpOnly;
  }

  public setHttpOnly(httpOnly: boolean): void {
    this.httpOnly = httpOnly;
  }

  public getDomain(): string {
    return this.domain;
  }

  public setDomain(domain: string): void {
    this.domain = domain;
  }

  public getPath(): string {
    return this.path;
  }

  public setPath(path: string): void {
    this.path = path;
  }

  public getSameSite(): SameSiteCookieOption {
    return this.sameSite;
  }

  public setSameSite(sameSite: SameSiteCookieOption): void {
    this.sameSite = sameSite;
  }

  public serialize(): string {
    const encodedValue = encodeURIComponent(this.value);
    let attributes = `${this.name}=${encodedValue}`;

    if (this.expiryDate) {
      attributes += `; Expires=${this.expiryDate.toUTCString()}`;
    }

    if (this.httpOnly) {
      attributes += '; HttpOnly';
    }

    if (this.domain) {
      attributes += `; Domain=${this.domain}`;
    }

    if (this.path) {
      attributes += `; Path=${this.path}`;
    }

    if (this.sameSite) {
      switch (this.sameSite) {
        case 'Lax':
          attributes += '; SameSite=Lax';
          break;
        case 'Strict':
          attributes += '; SameSite=Strict';
          break;
        case 'None':
          attributes += '; SameSite=None';
          break;
        default:
      }
    }

    return attributes;
  }

}
