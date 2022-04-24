import { Request, Response } from 'express';
import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { MachinePartRepository } from '@/repositories/machinePart/MachinePartRepository';
import { MachinePart } from '@/entities/MachinePart';

@ControllerMapping('/test')
export class TestController extends Controller {

  private readonly repo: MachinePartRepository;

  public constructor(repo: MachinePartRepository) {
    super();
    this.repo = repo;
  }

  @RouteMapping('/', Methods.GET)
  private async index(req: Request, res: Response): Promise<void> {
    const oldEntity = new MachinePart()
      .setPartName('eieieieieieieiie')
      .setStatus('ieiieieieie');

    const newEntity = new MachinePart()
      .setStatus('this not changed');

    const result = await this.repo.delete(newEntity);
    res.status(200).json({
      result,
    });
  }

  @RouteMapping('/404', Methods.GET)
  private async notFound(req: Request, res: Response): Promise<void> {
    throw new NotFoundException('test');
  }

  @RouteMapping('/500', Methods.GET)
  private async throwError(req: Request, res: Response): Promise<void> {
    throw new Error('test');
  }

}
