@IsTest
private class SaveResultProxyTest {
  @IsTest
  static void it_should_construct() {
    Account acc = new Account();
    Database.SaveResult sr = Database.insert(acc, false);
    System.Assert.isFalse(sr.isSuccess());

    Test.startTest();

    SaveResultProxy proxy = SaveResultProxy.fromDBSaveResult(sr);

    Test.stopTest();

    System.Assert.isNotNull(proxy);

    System.Assert.isFalse(proxy.success);
    System.Assert.isNull(proxy.id);
    System.Assert.areEqual(1, proxy.errors.size());

    ErrorProxy error = proxy.errors[0];
    System.Assert.areEqual(String.valueOf(Account.Name), error.fields.get(0));
    System.Assert.areEqual(
      'Required fields are missing: [Name]',
      error.message
    );
    System.Assert.areEqual(StatusCode.REQUIRED_FIELD_MISSING, error.statusCode);
  }
}
