import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { Authentication } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { Staff } from '@/entities/Staff';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { Request, Response } from 'express';

@ControllerMapping('/staff')
export class StaffController extends Controller {

  private readonly staffRepository: StaffRepository;

  public constructor(staffRepository: StaffRepository) {
    super();
    this.staffRepository = staffRepository;
  }

  @Authentication()
  @RouteMapping('/', Methods.GET)
  private async getInfo(req: Request, res: Response): Promise<void> {
    const expectedStaff = new Staff().setStaffId(req.session.staffId);

    const [staff] = await this.staffRepository.read(expectedStaff);
    staff.setPassword(undefined);

    res
      .status(200)
      .json({
        data: staff,
      });
  }

}
