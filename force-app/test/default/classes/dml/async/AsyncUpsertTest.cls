@IsTest
private class AsyncUpsertTest {
  static Mock dml;
  static MethodSpy dml_upsertRecords;

  static AsyncUpsert sut;

  static {
    dml = Mock.forType(DmlService.class);
    dml_upsertRecords = dml.spyOn('upsertRecords');

    sut = new AsyncUpsert((DmlService) dml.stub);
  }

  @IsTest
  static void it_should_invoke_dml_when_called() {
    Account garbageMan = TestUtil.createAccount('Mamoa');
    List<Account> characters = new List<Account>{ garbageMan };

    Test.startTest();

    sut.enqueue(characters);

    Test.stopTest();

    Expect.that(dml_upsertRecords).hasBeenCalledTimes(1);
    Expect.that(dml_upsertRecords).hasBeenCalledWith(characters);
  }
}
