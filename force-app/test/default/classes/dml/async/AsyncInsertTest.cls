@IsTest
private class AsyncInsertTest {
  static Mock dml;
  static MethodSpy dml_insertRecords;

  static AsyncInsert sut;

  static {
    dml = Mock.forType(DmlService.class);
    dml_insertRecords = dml.spyOn('insertRecords');

    sut = new AsyncInsert((DmlService) dml.stub);
  }

  @IsTest
  static void it_should_invoke_dml_when_called() {
    Contact garbageMan = TestUtil.createContact('Mamoa');
    List<Contact> characters = new List<Contact>{ garbageMan };
    sut.setRecords(characters);

    Test.startTest();

    sut.call();

    Test.stopTest();

    Expect.that(dml_insertRecords).hasBeenCalledTimes(1);
    Expect.that(dml_insertRecords).hasBeenCalledWith(characters);
  }
}
