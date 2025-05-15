public with sharing class DateUtil {
  /**
   * Count the weekdays between two dates
   */
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

    while (currentDate <= toDate) {
      integer currentDay = dayInWeekInt(currentDate);
      if (0 < currentDay && currentDay < 6) {
        weekdays++;
      }
      currentDate = currentDate.addDays(1);
    }

    return weekdays;
  }

  /**
   * Count the days between two dates that are in the days list
   */
  public static Integer daysBetween(
    Date fromDate,
    Date toDate,
    List<Day> days
  ) {
    Integer weekdays = 0;

    Date currentDate = Date.newInstance(
      fromDate.year(),
      fromDate.month(),
      fromDate.day()
    );

    while (currentDate <= toDate) {
      Day currentDay = dayInWeek(currentDate);
      if (days.contains(currentDay)) {
        weekdays++;
      }
      currentDate = currentDate.addDays(1);
    }

    return weekdays;
  }

  /**
   * Returns the integer day in the week 0 indexed to Sunday
   * */
  public static Integer dayInWeekInt(Date d) {
    return dayInWeek(d).ordinal();
  }

  public static Day dayInWeek(Date d) {
    Date epoch = Date.newInstance(1900, 1, 7); // Sunday
    return Day.values().get(Math.mod(epoch.daysBetween(d), 7));
  }

  public static List<Day> getWorkdays(List<String> workdays) {
    List<Day> days = new List<Day>();
    for (String dayStr : workdays) {
      days.add(Day.valueOf(dayStr));
    }
    return days;
  }
}
