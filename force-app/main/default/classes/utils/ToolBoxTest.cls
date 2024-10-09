@isTest
private class ToolBoxTest {
  static testMethod void getSObjectType_givenName_shouldGetType() {
    Schema.SObjectType accountType = Schema.Account.SObjectType;

    Test.startTest();

    Schema.SObjectType objectType = ToolBox.getSObjectType('Account');

    Test.stopTest();

    System.assertEquals(accountType, objectType);
  }

  static testMethod void getSObjectType_givenId_shouldGetType() {
    Schema.SObjectType userType = Schema.User.SObjectType;

    Test.startTest();

    Schema.SObjectType objectType = ToolBox.getSObjectType(
      (Id) UserInfo.getUserId()
    );

    Test.stopTest();

    System.assertEquals(userType, objectType);
  }

  static testMethod void getRecordTypeId_givenCaseMaster_shouldGetId() {
    Test.startTest();

    Id caseMaster = ToolBox.getRecordTypeId('Case', 'Master');

    Test.stopTest();
    System.assertNotEquals(null, caseMaster);
  }

  static testMethod void getRecordTypeIdsByObject_givenCase_shouldGetMaster() {
    String sobjectName = 'Case';

    Test.startTest();

    Map<String, Id> recordTypeIds = ToolBox.getRecordTypeIdsByObject(
      sobjectName
    );

    Test.stopTest();

    System.assert(recordTypeIds.containsKey('Master'));
  }

  static testMethod void getPicklistEntries_givenField_shouldGetEntries() {
    List<Schema.PicklistEntry> accountSource = Schema.Account.AccountSource.getDescribe()
      .getPicklistValues();

    Test.startTest();

    List<Schema.PickListEntry> entries = ToolBox.getPicklistEntries(
      'Account',
      'AccountSource'
    );

    Test.stopTest();

    System.assertEquals(accountSource.size(), entries.size());
  }

  static testMethod void generateUUID_default_shouldGetID() {
    Test.startTest();

    String guid = ToolBox.generateUUID();

    Test.stopTest();

    System.assertNotEquals(null, guid);
  }

  static testMethod void generateUUID_default_shouldGetUniqueIDs() {
    Test.startTest();

    String guid1 = ToolBox.generateUUID();
    String guid2 = ToolBox.generateUUID();

    Test.stopTest();

    System.assertNotEquals(guid1, guid2, 'Two generated GUIDs are unique.');
  }

  static testMethod void setUnwritableField_givenCaseNumber_shouldSetCaseNumber() {
    Case c = new Case(Subject = 'Test Case');
    String CASE_NUMBER = '00001111';

    Test.startTest();

    c = (Case) ToolBox.setUnwritableField(c, 'CaseNumber', CASE_NUMBER);

    Test.stopTest();

    System.assertEquals(CASE_NUMBER, c.CaseNumber);
  }

  static testMethod void generateUUID_default_shouldBeValidVersion4UUID() {
    // https://salesforce.stackexchange.com/a/223381
    // Version 4, random UUID format
    // xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
    // M is the Version, 4
    // N is the Variant, either a, b, 8, or 9
    Pattern p = Pattern.compile(
      '[\\w]{8}-[\\w]{4}-4[\\w]{3}-[89ab][\\w]{3}-[\\w]{12}'
    );
    for (Integer x = 0; x < 100; x++) {
      Matcher m = p.matcher(ToolBox.generateUUID());
      System.assert(m.matches() == true);
    }
  }
}
