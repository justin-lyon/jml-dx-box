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

    Id jobId = sut.enqueue(characters);

    Test.stopTest();

    System.Assert.isNotNull(jobId);
    AsyncApexJob job = [
      SELECT Id, Status
      FROM AsyncApexJob
      WHERE Id = :jobId
      LIMIT 1
    ];
    System.Assert.areEqual('Completed', job.Status);

    Expect.that(dml_deleteRecords).hasBeenCalledTimes(1);
    Expect.that(dml_deleteRecords).hasBeenCalledWith(characters);
  }
}
