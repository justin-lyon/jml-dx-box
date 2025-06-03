@IsTest
private class MockIdGeneratorTest {
  @IsTest
  static void getMockId_givenAccount_shouldGetAccountPrefixId() {
    Account acc = new Account();
    MockIdGenerator idGen = new MockIdGenerator(acc);
    String accountIdPrefix = Account.getSObjectType()
      .getDescribe()
      .getKeyPrefix();

    Test.startTest();

    String accountId = idGen.getMockId();

    Test.stopTest();

    System.Assert.areEqual(accountIdPrefix, accountId.substring(0, 3));
    System.Assert.areEqual(18, accountId.length(), accountId);
  }

  @IsTest
  static void statelessMockId_givenContact_shouldGetContactId() {
    Contact con = new Contact();
    String contactIdPrefix = Contact.getSObjectType()
      .getDescribe()
      .getKeyPrefix();

    Test.startTest();

    String contactId = MockIdGenerator.getMockId(con);

    Test.stopTest();

    System.Assert.areEqual(contactIdPrefix, contactId.substring(0, 3));
    System.Assert.areEqual(18, contactId.length(), contactId);
  }

  @IsTest
  static void getMockId_givenTwoObjectStates_shouldGetUniqueObjectCounts() {
    MockIdGenerator accGen = new MockIdGenerator(new Account());
    MockIdGenerator conGen = new MockIdGenerator(new Contact());

    Test.startTest();

    String accountId = accGen.getMockId();
    String contactId = conGen.getMockId();

    Test.stopTest();

    String accountWithoutPrefix = accountId.substring(3, 18);
    String contactWithoutPrefix = contactId.substring(3, 18);

    System.Assert.areEqual(accountWithoutPrefix, contactWithoutPrefix);
  }
}
