public with sharing class BusinessDays {
  private List<Boolean> businessDay = new Boolean[7];
  private List<Time> startHours = new Time[7];
  private List<Time> endHours = new Time[7];

  private final Date KNOWN_SUNDAY = date.newInstance(2013, 1, 6);
  private final BusinessHours bh;

  public BusinessDays() {
    this('Default');
  }

  public BusinessDays(String name) {
    this.bh = queryBusinessHours(name);

    setBusinessDays();
    setStartHours();
    setEndHours();
  }

  public Boolean isBusinessDay(Date inputDate) {
    Integer i = getDay(inputDate);
    return businessDay[i];
  }

  public Time getStartTime(Date inputDate) {
    Integer i = getDay(inputDate);
    return startHours[i];
  }

  public Time getEndTime(Date inputDate) {
    Integer i = getDay(inputDate);
    return endHours[i];
  }

  public Date nextBusinessDay(Date inputDate) {
    Date nextDate = inputDate.addDays(1);
    Integer nextDay = getDay(nextDate);
    Date nextBusinessDay = nextDate;
    while (!businessDay[Math.mod(nextDay, 7)]) {
      nextDay++;
      nextBusinessDay = nextBusinessDay.addDays(1);
    }
    return nextBusinessDay;
  }

  private Integer getDay(Date inputDate) {
    return Math.mod(Math.abs(this.KNOWN_SUNDAY.daysBetween(inputDate)), 7);
  }

  private void setBusinessDays() {
    businessDay[0] = bh.SundayStartTime != null;
    businessDay[1] = bh.MondayStartTime != null;
    businessDay[2] = bh.TuesdayStartTime != null;
    businessDay[3] = bh.WednesdayStartTime != null;
    businessDay[4] = bh.ThursdayStartTime != null;
    businessDay[5] = bh.FridayStartTime != null;
    businessDay[6] = bh.SaturdayStartTime != null;
  }

  private void setStartHours() {
    startHours[0] = bh.SundayStartTime;
    startHours[1] = bh.MondayStartTime;
    startHours[2] = bh.TuesdayStartTime;
    startHours[3] = bh.WednesdayStartTime;
    startHours[4] = bh.ThursdayStartTime;
    startHours[5] = bh.FridayStartTime;
    startHours[6] = bh.SaturdayStartTime;
  }

  private void setEndHours() {
    endHours[0] = bh.SundayEndTime;
    endHours[1] = bh.MondayEndTime;
    endHours[2] = bh.TuesdayEndTime;
    endHours[3] = bh.WednesdayEndTime;
    endHours[4] = bh.ThursdayEndTime;
    endHours[5] = bh.FridayEndTime;
    endHours[6] = bh.SaturdayEndTime;
  }

  private BusinessHours queryBusinessHours(String name) {
    return [
      SELECT
        Id,
        Name,
        SundayStartTime,
        MondayStartTime,
        TuesdayStartTime,
        WednesdayStartTime,
        ThursdayStartTime,
        FridayStartTime,
        SaturdayStartTime,
        SundayEndTime,
        MondayEndTime,
        TuesdayEndTime,
        WednesdayEndTime,
        ThursdayEndTime,
        FridayEndTime,
        SaturdayEndTime
      FROM BusinessHours
      WHERE Name = :name AND IsActive = TRUE
    ];
  }
}
