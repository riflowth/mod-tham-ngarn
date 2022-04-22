import { RouteHandler } from '@/controllers/Route';
import { HttpException } from '@/exceptions/HttpException';
import { NextFunction, Request, Response } from 'express';

export class ErrorHandler {

  public static getHandler() {
    const errorHandler = (error: HttpException | Error, req, res, next) => {
      const statusCode = (error instanceof HttpException)
        ? error.getStatusCode()
        : 500;

      res
        .status(statusCode)
        .json({
          error: error.name,
          message: error.message,
          timestamp: new Date(),
        });
    };

    const notFoundHandler = (req, res) => {
      res
        .status(404)
        .json({
          path: req.baseUrl + req.path,
          messsage: 'request not found',
        });
    };

    return [errorHandler, notFoundHandler];
  }

  public static wrap(routeHandler: RouteHandler): RouteHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await routeHandler(req, res, next);
      } catch (error: unknown) {
        next(error);
      }
    };
  }

}
