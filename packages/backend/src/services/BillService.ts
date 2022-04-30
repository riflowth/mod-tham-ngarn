import { Bill } from '@/entities/Bill';
import { Order } from '@/entities/Order';
import { Staff } from '@/entities/Staff';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { BadRequestException, NotFoundException, ForbiddenException } from 'springpress';

export class BillService {

  private readonly billRepository: BillRepository;
  private readonly staffRepository: StaffRepository;
  private readonly orderRepository: OrderRepository;

  public constructor(
    billRepository: BillRepository,
    staffRepository: StaffRepository,
    orderRepository: OrderRepository,
  ) {
    this.billRepository = billRepository;
    this.staffRepository = staffRepository;
    this.orderRepository = orderRepository;
  }

  public async getAllBills(readOptions?: ReadOptions): Promise<Bill[]> {
    const expectedBills = new Bill();
    return this.billRepository.read(expectedBills, readOptions);
  }

  public async getBillsByBranchId(branchId: number, readOptions?: ReadOptions): Promise<Bill[]> {
    await this.validateNumber(branchId, 'Branch id');
    return this.billRepository.readByBranchId(branchId, readOptions);
  }

  public async addBill(newBill: Bill): Promise<Bill> {
    await this.validateNumber(newBill.getOrderBy(), 'Order by id');
    await this.validateStaff(newBill.getOrderBy());

    return this.billRepository.create(newBill);
  }

  public async editBill(billId: number, newBill: Bill, staffId: number): Promise<Bill> {
    await this.validateNumber(billId, 'Bill id');
    const targetBill = await this.validateBill(billId, staffId);

    const newStaffId = newBill.getOrderBy();

    if (newStaffId !== undefined) {
      await this.validateNumber(newBill.getOrderBy(), 'Order by id');
      await this.validateStaff(newStaffId);
      await this.validateBill(billId, newStaffId);
    }

    const affectedRowsAmount = await this.billRepository.update(newBill, targetBill);

    return affectedRowsAmount === 1 ? newBill.setBillId(billId) : null;
  }

  public async deleteBill(billId: number, staffId: number): Promise<Bill> {
    await this.validateNumber(billId, 'Bill id');
    const targetBill = await this.validateBill(billId, staffId);

    const expectedRelatedOrders = new Order().setBillId(billId);
    const relatedOrders = await this.orderRepository.read(expectedRelatedOrders);

    if (relatedOrders.length !== 0) {
      throw new BadRequestException('There are orders still related to this bill');
    }

    const affectedRowsAmount = await this.billRepository.delete(targetBill);

    return affectedRowsAmount === 1 ? targetBill : null;
  }

  private async validateNumber(numberToValidate: number, name: string): Promise<void> {
    if (numberToValidate === null) {
      throw new BadRequestException(`${name} must be a positive integer`);
    }
  }

  private async validateStaff(staffId: number): Promise<void> {
    const expectedRelatedStaff = new Staff().setStaffId(staffId);
    const [expectedStaff] = await this.staffRepository.read(expectedRelatedStaff);

    if (!expectedStaff) {
      throw new NotFoundException('Staff related to bill does not exist');
    }
  }

  private async validateBill(billId: number, staffId: number): Promise<Bill> {
    const billToValidate = new Bill().setBillId(billId);
    const [targetBill] = await this.billRepository.read(billToValidate);

    if (!targetBill) {
      throw new NotFoundException('Bill does not exist');
    }

    const ordererToValidate = new Staff().setStaffId(targetBill.getOrderBy());
    const [targetOrderer] = await this.staffRepository.read(ordererToValidate);

    const currentStaffToValidate = new Staff().setStaffId(staffId);
    const [targetCurrentStaff] = await this.staffRepository.read(currentStaffToValidate);

    if (
      targetOrderer.getBranchId() !== targetCurrentStaff.getBranchId()
      && targetCurrentStaff.getPosition() !== 'CEO'
    ) {
      throw new ForbiddenException('Bill does not belong to the provided staff\'s branch');
    }

    return targetBill;
  }

}
