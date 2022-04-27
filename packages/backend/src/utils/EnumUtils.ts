export class EnumUtils {

  public static isIncludesInEnum<T extends string>(value: T, enumType: any): boolean {
    return enumType[value as any] !== undefined;
  }

}
