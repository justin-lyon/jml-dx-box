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
  static void it_should_call_dml_when_happy() {
    Contact garbageMan = TestUtil.createContact('Mamoa');
    List<Contact> characters = new List<Contact>{ garbageMan };
    sut.setRecords(characters);

    Test.startTest();

    sut.call();

    Test.stopTest();

    Expect.that(dml_insertRecords).hasBeenCalledTimes(1);
    Expect.that(dml_insertRecords).hasBeenCalledWith(characters);
  }

  @IsTest
  static void it_should_throw_when_missing_records() {
    Test.startTest();

    try {
      sut.call();
      System.Assert.fail();
    } catch (IllegalArgumentException e) {
      System.Assert.areEqual(
        AsyncDmlBase.ERROR_RECORDS_REQUIRED,
        e.getMessage()
      );
    }

    Test.stopTest();

    Expect.that(dml_insertRecords).hasNotBeenCalled();
  }
}
