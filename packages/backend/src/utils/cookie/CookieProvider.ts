import crypto from 'crypto';
import { Cookie } from '@/utils/cookie/Cookie';
import { Request, Response } from 'express';

export class CookieProvider {

  private static readonly signedSymbol: string = '$:';
  private readonly secret: string;

  public constructor(secret: string) {
    this.secret = secret;
  }

  public setCookie(res: Response, cookie: Cookie): void {
    cookie.setValue([
      CookieProvider.signedSymbol,
      this.sign(cookie.getValue()),
    ].join(''));
    res.setHeader('Set-Cookie', cookie.serialize());
  }

  public getCookie(req: Request, name: string): string {
    const header = req.headers.cookie;
    let value = null;

    if (header) {
      const cookies = header
        .split(';')
        .map((v) => v.split('='))
        .reduce((acc, v) => {
          acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
          return acc;
        }, {});

      const cookie: string = cookies[name];
      const { signedSymbol } = CookieProvider;

      if (cookie.substring(0, signedSymbol.length) === signedSymbol) {
        value = this.unsign(cookie.slice(signedSymbol.length));
      }
    }

    return value;
  }

  public sign(value: string): string {
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(value)
      .digest('base64')
      .replace(/=+$/, '');
    return `${value}.${signature}`;
  }

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
