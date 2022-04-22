import { HttpException } from '@/exceptions/HttpException';
import { AuthException } from '@/exceptions/service/AuthException';

export class LoginException extends HttpException implements AuthException {

  public getStatusCode(): number {
    return 400;
  }

}
