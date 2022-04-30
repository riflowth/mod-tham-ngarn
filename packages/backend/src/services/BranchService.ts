import { Address } from '@/entities/Address';
import { Branch } from '@/entities/Branch';
import { Zone } from '@/entities/Zone';
import { AddressRepository } from '@/repositories/address/AddressRepository';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { BadRequestException, NotFoundException } from 'springpress';

export class BranchService {

  private readonly addressRepository: AddressRepository;
  private readonly branchRepository: BranchRepository;
  private readonly zoneRepository: ZoneRepository;

  public constructor(
    addressRepository: AddressRepository,
    branchRepository: BranchRepository,
    zoneRepository: ZoneRepository,
  ) {
    this.addressRepository = addressRepository;
    this.branchRepository = branchRepository;
    this.zoneRepository = zoneRepository;
  }

  public async getAllBranches(readOptions?: ReadOptions): Promise<Branch[]> {
    const branchToRead = new Branch();
    return this.branchRepository.read(branchToRead, readOptions);
  }

  public async getBranchByBranchId(branchId: number): Promise<Branch[]> {
    const branchToRead = new Branch().setBranchId(branchId);
    return this.branchRepository.read(branchToRead);
  }

  public async addBranch(newBranch: Branch): Promise<Branch> {
    const relatedAddressToRead = new Address().setPostalCode(newBranch.getPostalCode());
    const [relatedAddress] = await this.addressRepository.read(relatedAddressToRead);

    if (!relatedAddress) {
      throw new BadRequestException('Postal code related to branch does not existed');
    }

    return this.branchRepository.create(newBranch);
  }

  public async editBranch(branchId: number, newBranch: Branch): Promise<Branch> {
    const branchToEdit = new Branch().setBranchId(branchId);
    const [targetBranch] = await this.branchRepository.read(branchToEdit);

    if (!targetBranch) {
      throw new NotFoundException('Target branch to edit does not exist');
    }

    const newPostalCode = newBranch.getPostalCode();

    if (newPostalCode) {
      const relatedAddressToEdit = new Address().setPostalCode(newPostalCode);
      const [relatedAddress] = await this.addressRepository.read(relatedAddressToEdit);

      if (!relatedAddress) {
        const newAddressToCreate = new Address().setPostalCode(newPostalCode);
        await this.addressRepository.create(newAddressToCreate);
      }
    }

    const affectedRowsAmount = await this.branchRepository.update(newBranch, branchToEdit);

    return affectedRowsAmount === 1 ? newBranch.setPrimaryKey(branchId) : null;
  }

  public async deleteBranch(branchId: number): Promise<Branch> {
    const branchToDelete = new Branch().setBranchId(branchId);
    const [targetBranch] = await this.branchRepository.read(branchToDelete);

    if (!targetBranch) {
      throw new BadRequestException('Target branch to delete does not exist');
    }

    const relatedZoneToRead = new Zone().setBranchId(branchId);
    const relatedZone = await this.zoneRepository.read(relatedZoneToRead);

    if (relatedZone.length > 0) {
      throw new BadRequestException('Target branch to delete has related zone.');
    }

    const affectedRowsAmount = await this.branchRepository.delete(branchToDelete);

    return affectedRowsAmount === 1 ? targetBranch : null;
  }

}
