import { HttpException } from '@/exceptions/HttpException';

export class InvalidRequestException extends HttpException {

  public getStatusCode(): number {
    return 400;
  }

}
