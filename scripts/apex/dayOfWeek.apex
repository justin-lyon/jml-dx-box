Date epoch = Date.newInstance(1900, 1, 7); // Sunday
Date sunday = Date.newInstance(2025, 1, 12);
Date monday = Date.newInstance(2025, 1, 13);
Date tuesday = Date.newInstance(2025, 1, 14);
Date wednesday = Date.newInstance(2025, 1, 15);
Date thursday = Date.newInstance(2025, 1, 16);
Date friday = Date.newInstance(2025, 1, 17);
Date saturday = Date.newInstance(2025, 1, 18);

Assert.areEqual(0, Math.mod(epoch.daysBetween(sunday), 7));
Assert.areEqual(1, Math.mod(epoch.daysBetween(monday), 7));
Assert.areEqual(2, Math.mod(epoch.daysBetween(tuesday), 7));
Assert.areEqual(3, Math.mod(epoch.daysBetween(wednesday), 7));
Assert.areEqual(4, Math.mod(epoch.daysBetween(thursday), 7));
Assert.areEqual(5, Math.mod(epoch.daysBetween(friday), 7));
Assert.areEqual(6, Math.mod(epoch.daysBetween(saturday), 7));

Datetime startDatetime = Datetime.now();
Datetime endDatetime = Datetime.now().addDays(14).addHours(1);

Integer weekdays = DateUtil.weekdaysBetween(startDatetime, endDatetime);
System.debug(weekDays);

Date beforeDt = Date.today().addDays(-1);
Date afterDt = Date.today();
Boolean isAfter = beforeDt > afterDt;
System.debug(isAfter + ' ' + beforeDt + ' ' + afterDt);
