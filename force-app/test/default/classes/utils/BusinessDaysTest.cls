@isTest
private class BusinessDaysTest {
  static testMethod void constructor_givenDefault_shouldGetDefaultBusinessHours() {
    BusinessDays bd;

    Test.startTest();

    bd = new BusinessDays();

    Test.stopTest();

    System.assertNotEquals(null, bd, 'Should construct.');
  }

  static testMethod void isBusinessDay_givenMonday_shouldGetTrue() {
    Date monday = Date.newInstance(2019, 11, 11); // Monday Nov 11, 2019
    BusinessDays bd = new BusinessDays();

    Test.startTest();

    Boolean isBusinessDay = bd.isBusinessDay(monday);

    Test.stopTest();

    System.assert(isBusinessDay, 'Monday is a business day.');
  }

  static testMethod void isBusinessDay_givenSunday_shouldGetFalse() {
    Date sunday = Date.newInstance(2019, 11, 10); // Sunday Nov 10, 2019
    BusinessDays bd = new BusinessDays();

    Test.startTest();

    Boolean isBusinessDay = bd.isBusinessDay(sunday);

    Test.stopTest();

    System.assert(!isBusinessDay, 'Sunday is not a business day.');
  }

  static testMethod void getStartTime_givenMonday_shouldGet9amEastern() {
    Date monday = Date.newInstance(2019, 11, 11); // Monday Nov 11, 2019
    BusinessDays bd = new BusinessDays();

    Test.startTest();

    Time startTime = bd.getStartTime(monday);

    Test.stopTest();

    System.assertEquals(9, startTime.hour());
  }

  static testMethod void getEndTime_givenMonday_shouldGet5pmEastern() {
    Date monday = Date.newInstance(2019, 11, 11); // Monday Nov 11, 2019
    BusinessDays bd = new BusinessDays();

    Test.startTest();

    Time endTime = bd.getEndTime(monday);

    Test.stopTest();

    System.assertEquals(17, endTime.hour());
  }

  static testMethod void nextBusinessDay_givenSaturday_shouldGetMonday() {
    Date saturday = Date.newInstance(2019, 11, 9); // Saturday Nov 9, 2019
    Date monday = Date.newInstance(2019, 11, 11); // Monday Nov 11, 2019
    BusinessDays bd = new BusinessDays();

    Test.startTest();

    Date nextBusinessDay = bd.nextBusinessDay(saturday);

    Test.stopTest();

    System.assertEquals(
      monday,
      nextBusinessDay,
      'Next business day from Saturday is Monday.'
    );
  }
}
