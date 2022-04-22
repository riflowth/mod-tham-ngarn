export class DateUtil {

  public static formatToSQL(date: Date): string {
    return date.toLocaleString('sv');
  }

  public static formatFromSQL(date: string): Date {
    return new Date(date);
  }

}
