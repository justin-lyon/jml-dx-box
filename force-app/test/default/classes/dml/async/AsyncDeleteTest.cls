@IsTest
private class AsyncDeleteTest {
  static Mock dml;
  static MethodSpy dml_deleteRecords;

  static AsyncDelete sut;

  static {
    dml = Mock.forType(DmlService.class);
    dml_deleteRecords = dml.spyOn('deleteRecords');

    sut = new AsyncDelete((DmlService) dml.stub);
  }

  @IsTest
  static void it_should_invoke_dml_when_called() {
    Account garbageMan = TestUtil.createAccount('Mamoa');
    List<Account> characters = new List<Account>{ garbageMan };

    Test.startTest();

    sut.enqueue(characters);

    Test.stopTest();

    Expect.that(dml_deleteRecords).hasBeenCalledTimes(1);
    Expect.that(dml_deleteRecords).hasBeenCalledWith(characters);
  }
}
