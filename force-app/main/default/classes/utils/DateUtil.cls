public with sharing class DateUtil {
  public static Integer weekdaysBetween(
    DateTime fromDateTime,
    DateTime toDateTime
  ) {
    return weekdaysBetween(fromDateTime.date(), toDateTime.date());
  }

  public static Integer weekdaysBetween(Date fromDate, Date toDate) {
    Integer weekdays = 0;

    Date currentDate = Date.newInstance(
      fromDate.year(),
      fromDate.month(),
      fromDate.day()
    );

    while (!(currentDate > toDate)) {
      integer currentDay = dayInWeekInt(currentDate);
      if (0 < currentDay && currentDay < 6) {
        weekdays++;
      }
      currentDate = currentDate.addDays(1);
    }

    return weekdays;
  }

  public static Integer daysBetween(
    Date fromDate,
    Date toDate,
    List<Day> workdays
  ) {
    Integer weekdays = 0;

    Date currentDate = Date.newInstance(
      fromDate.year(),
      fromDate.month(),
      fromDate.day()
    );

    while (!(currentDate > toDate)) {
      Day currentDay = dayInWeek(currentDate);
      if (workdays.contains(currentDay)) {
        weekdays++;
      }
      currentDate = currentDate.addDays(1);
    }

    return weekdays;
  }

  /**
   * Returns the integer day in the week 0 indexed to Sunday
   * */
  public static Day dayInWeek(Date d) {
    Date epoch = Date.newInstance(1900, 1, 6); // Sunday
    return Day.values().get(Math.mod(epoch.daysBetween(d), 7));
  }

  public static Integer dayInWeekInt(Date d) {
    Date epoch = Date.newInstance(1900, 1, 6); // Sunday
    return Math.mod(epoch.daysBetween(d), 7);
  }
}
