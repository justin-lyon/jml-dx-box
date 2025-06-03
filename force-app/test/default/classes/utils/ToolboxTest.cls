@IsTest
private class ToolboxTest {
  @IsTest
  static void getSObjectType_givenName_shouldGetType() {
    Schema.SObjectType accountType = Schema.Account.SObjectType;

    Test.startTest();

    Schema.SObjectType objectType = Toolbox.getSObjectType('Account');

    Test.stopTest();

    System.Assert.areEqual(accountType, objectType);
  }

  @IsTest
  static void getSObjectType_givenId_shouldGetType() {
    Schema.SObjectType userType = Schema.User.SObjectType;

    Test.startTest();

    Schema.SObjectType objectType = Toolbox.getSObjectType(
      (Id) UserInfo.getUserId()
    );

    Test.stopTest();

    System.Assert.areEqual(userType, objectType);
  }

  @IsTest
  static void getRecordTypeId_givenCaseMaster_shouldGetId() {
    Test.startTest();

    Id caseMaster = Toolbox.getRecordTypeId('Case', 'Master');

    Test.stopTest();
    System.assertNotEquals(null, caseMaster);
  }

  @IsTest
  static void getRecordTypeIdsByObject_givenCase_shouldGetMaster() {
    String sobjectName = 'Case';

    Test.startTest();

    Map<String, Id> recordTypeIds = Toolbox.getRecordTypeIdsByObject(
      sobjectName
    );

    Test.stopTest();

    System.assert(recordTypeIds.containsKey('Master'));
  }

  @IsTest
  static void getPicklistEntries_givenField_shouldGetEntries() {
    List<Schema.PicklistEntry> accountSource = Schema.Account.AccountSource.getDescribe()
      .getPicklistValues();

    Test.startTest();

    List<Schema.PickListEntry> entries = Toolbox.getPicklistEntries(
      'Account',
      'AccountSource'
    );

    Test.stopTest();

    System.Assert.areEqual(accountSource.size(), entries.size());
  }

  @IsTest
  static void generateUUID_default_shouldGetID() {
    Test.startTest();

    String guid = Toolbox.generateUUID();

    Test.stopTest();

    System.assertNotEquals(null, guid);
  }

  @IsTest
  static void generateUUID_default_shouldGetUniqueIDs() {
    Test.startTest();

    String guid1 = Toolbox.generateUUID();
    String guid2 = Toolbox.generateUUID();

    Test.stopTest();

    System.assertNotEquals(guid1, guid2, 'Two generated GUIDs are unique.');
  }

  @IsTest
  static void setUnwritableField_givenCaseNumber_shouldSetCaseNumber() {
    Case c = new Case(Subject = 'Test Case');
    String CASE_NUMBER = '00001111';

    Test.startTest();

    c = (Case) Toolbox.setUnwritableField(c, 'CaseNumber', CASE_NUMBER);

    Test.stopTest();

    System.Assert.areEqual(CASE_NUMBER, c.CaseNumber);
  }

  @IsTest
  static void generateUUID_default_shouldBeValidVersion4UUID() {
    // https://salesforce.stackexchange.com/a/223381
    // Version 4, random UUID format
    // xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
    // M is the Version, 4
    // N is the Variant, either a, b, 8, or 9
    Pattern p = Pattern.compile(
      '[\\w]{8}-[\\w]{4}-4[\\w]{3}-[89ab][\\w]{3}-[\\w]{12}'
    );
    for (Integer x = 0; x < 100; x++) {
      Matcher m = p.matcher(Toolbox.generateUUID());
      System.assert(m.matches() == true);
    }
  }
}
