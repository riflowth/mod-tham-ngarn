import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { Address } from '@/entities/Address';
import { ReadOptions } from '@/repositories/ReadOptions';
import { AddressService } from '@/services/AddressService';
import {
  BadRequestException,
  Controller,
  ControllerMapping,
  Methods,
  Request,
  RequestBody,
  Response,
  RouteMapping,
} from 'springpress';

@ControllerMapping('/address')
export class AddressController extends Controller {

  private readonly addressService: AddressService;

  public constructor(addressService: AddressService) {
    super();
    this.addressService = addressService;
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/me', Methods.GET)
  private async getAddressByRequester(req: Request, res: Response): Promise<void> {
    const address = await this.addressService.getAddressByBranchId(req.session.branchId);
    res.status(200).json({ data: address });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.GET)
  private async getAllAddresses(req: Request, res: Response): Promise<void> {
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const addresses = await this.addressService.getAllAddresses(readOptions);
    res.status(200).json({ data: addresses });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/:postalCode', Methods.GET)
  private async getAddressByPostalCode(req: Request, res: Response): Promise<void> {
    const address = await this.addressService.getAddressByPostalCode(req.params.postalCode);
    res.status(200).json({ data: address });
  }

  @Authentication(Role.CEO)
  @RouteMapping('/', Methods.POST)
  @RequestBody('postalCode', '?region', '?country')
  private async addAddress(req: Request, res: Response): Promise<void> {
    const { postalCode, region, country } = req.body;

    const newAddress = new Address()
      .setPostalCode(postalCode)
      .setRegion(region)
      .setCountry(country);
    const createdField = await this.addressService.addAddress(newAddress);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.CEO)
  @RouteMapping('/:postalCode', Methods.PUT)
  @RequestBody('?region', '?country')
  private async editAddressByPostalCode(req: Request, res: Response): Promise<void> {
    const { region, country } = req.body;

    if (region === undefined && country === undefined) {
      throw new BadRequestException('No provided data to update');
    }

    const newAddress = new Address()
      .setRegion(region)
      .setCountry(country);
    const updatedField = await this.addressService.editAddress(req.params.postalCode, newAddress);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.CEO)
  @RouteMapping('/:postalCode', Methods.DELETE)
  private async deleteAddressByPostalCode(req: Request, res: Response): Promise<void> {
    const deletedField = await this.addressService.deleteAddress(req.params.postalCode);
    res.status(200).json({ data: { deletedField } });
  }

}
