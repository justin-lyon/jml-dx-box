public with sharing class DateUtil {
  public static Integer weekdaysBetween(
    Datetime startDatetime,
    Datetime endDatetime
  ) {
    return weekdaysBetween(startDatetime.date(), endDatetime.date());
  }

  public static Integer weekdaysBetween(Date startDate, Date endDate) {
    Integer weekdays = 0;

    Date currentDate = Date.newInstance(
      startDate.year(),
      startDate.month(),
      startDate.day()
    );

    while (!(currentDate > endDate)) {
      integer currentDay = dayInWeek(currentDate);
      if (0 < currentDay && currentDay < 6) {
        weekdays++;
      }
      currentDate = currentDate.addDays(1);
    }

    return weekdays;
  }

  /**
   * Returns the integer day in the week 0 indexed to Sunday
   * */
  public static Integer dayInWeek(Date d) {
    Date epoch = Date.newInstance(1900, 1, 6); // Sunday
    return Math.mod(epoch.daysBetween(d), 7);
  }
}
