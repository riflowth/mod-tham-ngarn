import { Cookie, SameSiteCookieOption } from '@/utils/cookie/Cookie';

export class CookieBuilder {

  private cookie: Cookie;

  public constructor(name: string, value: string) {
    this.cookie = new Cookie(name, value);
  }

  public setExpiryDate(expiryDate: Date): CookieBuilder {
    this.cookie.setExpiryDate(expiryDate);
    return this;
  }

  public setMaxAge(milliseconds: number): CookieBuilder {
    this.cookie.setMaxAge(milliseconds);
    return this;
  }

  public setHttpOnly(httpOnly: boolean): CookieBuilder {
    this.cookie.setHttpOnly(httpOnly);
    return this;
  }

  public setDomain(domain: string): CookieBuilder {
    this.cookie.setDomain(domain);
    return this;
  }

  public setPath(path: string): CookieBuilder {
    this.cookie.setPath(path);
    return this;
  }

  public setSameSite(sameSite: SameSiteCookieOption): CookieBuilder {
    this.cookie.setSameSite(sameSite);
    return this;
  }

  public build(): Cookie {
    return this.cookie;
  }

}
