Date epoch = Date.newInstance(1900, 1, 7); // Sunday
Date sunday = Date.newInstance(2025, 1, 12);
Date monday = Date.newInstance(2025, 1, 13);
Date tuesday = Date.newInstance(2025, 1, 14);
Date wednesday = Date.newInstance(2025, 1, 15);
Date thursday = Date.newInstance(2025, 1, 16);
Date friday = Date.newInstance(2025, 1, 17);
Date saturday = Date.newInstance(2025, 1, 18);

Assert.areEqual(0, DateUtil.dayInWeekInt(sunday));
Assert.areEqual(1, DateUtil.dayInWeekInt(monday));
Assert.areEqual(2, DateUtil.dayInWeekInt(tuesday));
Assert.areEqual(3, DateUtil.dayInWeekInt(wednesday));
Assert.areEqual(4, DateUtil.dayInWeekInt(thursday));
Assert.areEqual(5, DateUtil.dayInWeekInt(friday));
Assert.areEqual(6, DateUtil.dayInWeekInt(saturday));

Date nextFriday = thursday.addDays(1);
Date nextMonday = thursday.addDays(4);
Date nextTuesday = thursday.addDays(5);
Datetime startDt = Datetime.newInstance(friday, Time.newInstance(0, 0, 0, 0));
Datetime endDt = Datetime.newInstance(nextMonday, Time.newInstance(0, 0, 0, 0));
Integer weekdays = DateUtil.weekdaysBetween(startDt, endDt);
System.debug(weekDays);
