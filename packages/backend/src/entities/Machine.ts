import { Entity } from '@/entities/Entity';

export class Machine implements Entity<Machine, number> {

  private machineId: number;
  private zoneId: number;
  private name: string;
  private serial: string;
  private manufacturer: string;
  private registrationDate: Date;
  private retiredDate: Date;

  public getPrimaryKey(): number {
    return this.machineId;
  }

  public getMachineId(): number {
    return this.machineId;
  }

  public getZoneId(): number {
    return this.zoneId;
  }

  public getName(): string {
    return this.name;
  }

  public getSerial(): string {
    return this.serial;
  }

  public getManufacturer(): string {
    return this.manufacturer;
  }

  public getRegistrationDate(): Date {
    return this.registrationDate;
  }

  public getRetiredDate(): Date {
    return this.retiredDate;
  }

  public setPrimaryKey(machineId: number): Machine {
    this.machineId = machineId;
    return this;
  }

  public setMachineId(machineId: number): Machine {
    this.machineId = machineId;
    return this;
  }

  public setZoneId(zoneId: number): Machine {
    this.zoneId = zoneId;
    return this;
  }

  public setName(name: string): Machine {
    this.name = name;
    return this;
  }

  public setSerial(serial: string): Machine {
    this.serial = serial;
    return this;
  }

  public setManufacturer(manufacturer: string): Machine {
    this.manufacturer = manufacturer;
    return this;
  }

  public setRegistrationDate(registrationDate: Date): Machine {
    this.registrationDate = registrationDate;
    return this;
  }

  public setRetiredDate(retiredDate: Date): Machine {
    this.retiredDate = retiredDate;
    return this;
  }

}
