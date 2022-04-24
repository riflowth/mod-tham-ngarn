import { HttpException } from '@/exceptions/HttpException';

export class ForbiddenException extends HttpException {

  public getStatusCode(): number {
    return 403;
  }

}
