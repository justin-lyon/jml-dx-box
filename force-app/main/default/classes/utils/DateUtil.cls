public with sharing class DateUtil {
  /**
   * Count the weekdays between two dates
   */
  public static Integer weekdaysBetween(Date fromDate, Date toDate) {
    List<Day> weekdays = new List<Day>{
      Day.MONDAY,
      Day.TUESDAY,
      Day.WEDNESDAY,
      Day.THURSDAY,
      Day.FRIDAY
    };

    return daysBetween(fromDate, toDate, weekdays);
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
