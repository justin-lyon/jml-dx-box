@IsTest
private class AsyncUpdateTest {
  static Mock dml;
  static MethodSpy dml_updateRecords;

  static AsyncUpdate sut;

  static {
    dml = Mock.forType(DmlService.class);
    dml_updateRecords = dml.spyOn('updateRecords');

    sut = new AsyncUpdate((DmlService) dml.stub);
  }

  @IsTest
  static void it_should_invoke_dml_when_called() {
    Contact steve = TestUtil.createContact('JackBlack');
    List<Contact> characters = new List<Contact>{ steve };
    sut.records = characters;

    sut.call();

    Expect.that(dml_updateRecords).hasBeenCalledTimes(1);
    Expect.that(dml_updateRecords).hasBeenCalledWith(characters);
  }
}
