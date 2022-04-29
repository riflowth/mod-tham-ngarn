import crypto from 'crypto';
import { Cookie } from '@/utils/cookie/Cookie';
import { Request, Response } from 'express';

export class CookieProvider {

  private static readonly SIGNED_SYMBOL: string = '$:';

  private readonly secret: string;

  public constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Set a cookie by HTTP response header
   * @param res - A http response instance
   * @param cookie - A cookie instance that needs to be set
   */
  public setCookie(res: Response, cookie: Cookie): void {
    res.setHeader('Set-Cookie', cookie.serialize());
  }

  /**
   * Get a cookie by a specific cookie name which verified by the signature
   * @param req - A http request instance
   * @param name - A cookie name which needs value
   * @returns A cookie value from specific name or null if cookie is invalid
   */
  public getCookie(req: Request, name: string): string {
    const header = req.headers.cookie;
    let value = null;

    if (header) {
      const cookie = this.parseCookieHeader(header)[name];

      if (cookie) {
        value = cookie;
      }
    }

    return value;
  }

  /**
   * Set a signed cookie by HTTP response header
   * @param res - A http response instance
   * @param cookie - A cookie instance that needs to be set
   */
  public setSignedCookie(res: Response, cookie: Cookie): void {
    cookie.setValue([
      CookieProvider.SIGNED_SYMBOL,
      this.sign(cookie.getValue()),
    ].join(''));

    res.setHeader('Set-Cookie', cookie.serialize());
  }

  /**
   * Get a signed cookie by a specific cookie name which verified by the signature
   * @param req - A http request instance
   * @param name - A cookie name which needs value
   * @returns A cookie value from specific name or null if cookie is invalid
   */
  public getSignedCookie(req: Request, name: string): string {
    const header = req.headers.cookie;
    let value = null;

    if (header) {
      const cookie = this.parseCookieHeader(header)[name];

      if (cookie) {
        const { SIGNED_SYMBOL } = CookieProvider;

        if (cookie.substring(0, SIGNED_SYMBOL.length) === SIGNED_SYMBOL) {
          value = this.unsign(cookie.slice(SIGNED_SYMBOL.length));
        }
      }
    }

    return value;
  }

  /**
   * Parse cookies from http cookie header into the key-value pairs
   * @param header - A http cookie header
   * @returns The key-value pairs parsed from http cookie header
   */
  public parseCookieHeader(header: string) {
    const reducer = (acc, value) => {
      acc[decodeURIComponent(value[0].trim())] = decodeURIComponent(value[1].trim());
      return acc;
    };

    return header
      .split(';')
      .map((value) => value.split('='))
      .reduce<Record<string, string>>(reducer, {});
  }

  /**
   * Sign a value with a secret key
   * @param value - A value to sign with the secret key
   * @returns A signed value
   */
  public sign(value: string): string {
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(value)
      .digest('base64')
      .replace(/=+$/, '');
    return [value, signature].join('.');
  }

  /**
   * Verify a signature with the secret key
   * @param value A value with signed signature
   * @returns A tentative value if signature is valid or null if invalid
   */
  public unsign(value: string): string {
    const tentativeValue = value.slice(0, value.lastIndexOf('.'));
    const expectedValue = this.sign(tentativeValue);
    const expectedBuffer = Buffer.from(expectedValue);
    const valueBuffer = Buffer.from(value);

    return (
      expectedBuffer.length === valueBuffer.length
      && crypto.timingSafeEqual(expectedBuffer, valueBuffer)
    ) ? tentativeValue : null;
  }

}
