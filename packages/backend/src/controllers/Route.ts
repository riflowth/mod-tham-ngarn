import { Role } from '@/decorators/AuthenticationDecorator';
import { NextFunction, Request, Response } from 'express';

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type RequestSession = Express.Request['session'];

export type RouteHandler = (req: Request, res: Response, next?: NextFunction) => Promise<void>;

export type Route = {
  handler: RouteHandler,
  metadata: RouteMetadata,
};

export type RouteMetadata = {
  path: string,
  method: Methods,
  authentication?: Role[],
};
