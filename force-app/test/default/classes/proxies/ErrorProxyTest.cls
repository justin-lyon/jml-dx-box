@IsTest
private class ErrorProxyTest {
  @IsTest
  static void it_should_construct() {
    Account acc = new Account();
    Database.SaveResult sr = Database.insert(acc, false);
    System.Assert.isFalse(sr.isSuccess());

    Test.startTest();

    ErrorProxy proxy = ErrorProxy.fromDBError(sr.getErrors()[0]);

    Test.stopTest();

    System.Assert.isNotNull(proxy);

    System.Assert.areEqual(String.valueOf(Account.Name), proxy.fields.get(0));
    System.Assert.areEqual(
      'Required fields are missing: [Name]',
      proxy.message
    );
    System.Assert.areEqual(StatusCode.REQUIRED_FIELD_MISSING, proxy.statusCode);
  }
}
