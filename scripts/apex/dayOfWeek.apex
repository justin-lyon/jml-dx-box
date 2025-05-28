Date epoch = Date.newInstance(1900, 1, 7); // Sunday = 0
Date sunday = Date.newInstance(2025, 1, 12);
Date monday = Date.newInstance(2025, 1, 13);
Date tuesday = Date.newInstance(2025, 1, 14);
Date wednesday = Date.newInstance(2025, 1, 15);
Date thursday = Date.newInstance(2025, 1, 16);
Date friday = Date.newInstance(2025, 1, 17);
Date saturday = Date.newInstance(2025, 1, 18);

Date nextFriday = thursday.addDays(1);
Date nextMonday = thursday.addDays(4);
Date nextTuesday = thursday.addDays(5);
Datetime startDt = Datetime.newInstance(friday, Time.newInstance(0, 0, 0, 0));
Datetime endDt = Datetime.newInstance(nextMonday, Time.newInstance(0, 0, 0, 0));

Integer weekdays = DateUtil.weekdaysBetween(startDt, endDt);
System.debug(weekDays);
System.Assert.areEqual(2, weekdays, 'Expected to find 2 weekdays between Friday and next Monday, inclusive.');
