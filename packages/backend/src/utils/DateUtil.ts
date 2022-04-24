export class DateUtil {

  public static formatToSQL(date: Date): string {
    if (!date) return undefined;
    return date.toLocaleString('sv');
  }

  public static formatFromSQL(date: string): Date {
    return new Date(date);
  }

}
