import { HttpException } from '@/exceptions/HttpException';

export class UnauthorizedException extends HttpException {

  public getStatusCode(): number {
    return 401;
  }

}
