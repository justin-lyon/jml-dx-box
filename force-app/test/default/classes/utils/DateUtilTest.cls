@IsTest
private class DateUtilTest {
  @IsTest
  static void it_should_return_2_days_between_friday_and_monday_datetimes() {
    Date friday = Date.newInstance(2025, 5, 23);
    Date monday = Date.newInstance(2025, 5, 26);

    DateTime friDt = DateTime.newInstance(friday, Time.newInstance(0, 0, 0, 0));
    DateTime monDt = DateTime.newInstance(monday, Time.newInstance(0, 0, 0, 0));

    Test.startTest();

    Integer days = DateUtil.weekdaysBetween(friDt, monDt);

    Test.stopTest();

    System.Assert.areEqual(
      2,
      days,
      'Expected 2 weekdays between Friday and the following Monday, inclusive.'
    );
  }

  @IsTest
  static void it_should_return_2_days_between_friday_and_monday_dates() {
    Date friday = Date.newInstance(2025, 5, 23);
    Date monday = Date.newInstance(2025, 5, 26);

    Test.startTest();

    Integer days = DateUtil.weekdaysBetween(friday, monday);

    Test.stopTest();

    System.Assert.areEqual(
      2,
      days,
      'Expected 2 weekdays between Friday and the following Monday, inclusive.'
    );
  }

  @IsTest
  static void it_should_return_1_day_when_from_and_to_are_same_day() {
    Date friday = Date.newInstance(2025, 5, 23);

    Test.startTest();

    Integer days = DateUtil.weekdaysBetween(friday, friday);

    Test.stopTest();

    System.Assert.areEqual(
      1,
      days,
      'Expected 1 weekday when from and to dates are the same day.'
    );
  }

  @IsTest
  static void it_should_return_1_day_from_monday_to_friday_when_days_is_monday() {
    Date monday = Date.newInstance(2025, 5, 26);
    Date friday = Date.newInstance(2025, 5, 30);

    List<Day> days = new List<Day>{ Day.Monday };

    Test.startTest();

    Integer daysCount = DateUtil.daysBetween(monday, friday, days);

    Test.stopTest();

    System.Assert.areEqual(
      1,
      daysCount,
      'Expected 1 day from Monday to Friday when searching for Monday.'
    );
  }

  @IsTest
  static void it_should_return_2_days_from_monday_to_friday_when_days_is_monday_and_tuesday() {
    Date monday = Date.newInstance(2025, 5, 26);
    Date friday = Date.newInstance(2025, 5, 30);

    List<Day> days = new List<Day>{ Day.Monday, Day.Tuesday };

    Test.startTest();

    Integer daysCount = DateUtil.daysBetween(monday, friday, days);

    Test.stopTest();

    System.Assert.areEqual(
      2,
      daysCount,
      'Expected 2 days from Monday to Friday when searching for Mondays and Tuesdays.'
    );
  }

  @IsTest
  static void it_should_return_SUNDAY_for_sunday() {
    Date sunday = Date.newInstance(2025, 5, 25);

    Test.startTest();

    Day actual = DateUtil.dayInWeek(sunday);

    Test.stopTest();

    System.Assert.areEqual(
      Day.SUNDAY,
      actual,
      'Expected SUNDAY for the given date.'
    );
  }

  @IsTest
  static void it_should_return_MONDAY_for_monday() {
    Date monday = Date.newInstance(2025, 5, 26);

    Test.startTest();

    Day actual = DateUtil.dayInWeek(monday);

    Test.stopTest();

    System.Assert.areEqual(
      Day.MONDAY,
      actual,
      'Expected MONDAY for the given date.'
    );
  }

  @IsTest
  static void it_should_return_TUESDAY_for_tuesday() {
    Date tuesday = Date.newInstance(2025, 5, 27);

    Test.startTest();

    Day actual = DateUtil.dayInWeek(tuesday);

    Test.stopTest();

    System.Assert.areEqual(
      Day.TUESDAY,
      actual,
      'Expected TUESDAY for the given date.'
    );
  }

  @IsTest
  static void it_should_return_WEDNESDAY_for_wednesday() {
    Date wednesday = Date.newInstance(2025, 5, 28);

    Test.startTest();

    Day actual = DateUtil.dayInWeek(wednesday);

    Test.stopTest();

    System.Assert.areEqual(
      Day.WEDNESDAY,
      actual,
      'Expected WEDNESDAY for the given date.'
    );
  }

  @IsTest
  static void it_should_return_THURSDAY_for_thursday() {
    Date thursday = Date.newInstance(2025, 5, 29);

    Test.startTest();

    Day actual = DateUtil.dayInWeek(thursday);

    Test.stopTest();

    System.Assert.areEqual(
      Day.THURSDAY,
      actual,
      'Expected THURSDAY for the given date.'
    );
  }

  @IsTest
  static void it_should_return_FRIDAY_for_friday() {
    Date friday = Date.newInstance(2025, 5, 30);

    Test.startTest();

    Day actual = DateUtil.dayInWeek(friday);

    Test.stopTest();

    System.Assert.areEqual(
      Day.FRIDAY,
      actual,
      'Expected FRIDAY for the given date.'
    );
  }

  @IsTest
  static void it_should_SATURDAY_for_saturday() {
    Date saturday = Date.newInstance(2025, 5, 31);

    Test.startTest();

    Day actual = DateUtil.dayInWeek(saturday);

    Test.stopTest();

    System.Assert.areEqual(
      Day.SATURDAY,
      actual,
      'Expected SATURDAY for the given date.'
    );
  }

  @IsTest
  static void it_should_get_DAYS_from_strings() {
    List<String> workdays = new List<String>{ 'MONDAY', 'TUESDAY' };

    Test.startTest();

    List<Day> days = DateUtil.getWorkdays(workdays);

    Test.stopTest();

    System.Assert.areEqual(
      2,
      days.size(),
      'Expected 2 days from the workdays list.'
    );
    System.Assert.areEqual(
      Day.MONDAY,
      days[0],
      'Expected first day to be MONDAY.'
    );
    System.Assert.areEqual(
      Day.TUESDAY,
      days[1],
      'Expected second day to be TUESDAY.'
    );
  }
}
