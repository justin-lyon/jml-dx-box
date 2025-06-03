@IsTest
private class AsyncDmlBaseTest {
  static Mock dml;
  static MethodSpy dml_insertRecords;

  static AsyncDmlBase sut;

  static {
    dml = Mock.forType(DmlService.class);
    dml_insertRecords = dml.spyOn('insertRecords');

    sut = new AsyncDmlBaseStub((DmlService) dml.stub);
  }

  @IsTest
  static void it_should_enqueue_an_async_job() {
    Test.startTest();

    Id jobId = sut.enqueue(
      new List<Account>{ new Account(Name = 'anystring') }
    );

    Test.stopTest();

    System.Assert.isNotNull(jobId, 'enqueue method should return a jobId');

    List<AsyncApexJob> jobs = [
      SELECT Id, JobType, Status
      FROM AsyncApexJob
      WHERE Id = :jobId
    ];
    System.Assert.areEqual(1, jobs.size(), 'There should be one queued job');
  }

  @IsTest
  static void it_should_throw_when_records_is_null() {
    Test.startTest();

    try {
      sut.enqueue(null);
      System.Assert.fail('Should throw IllegalArgumentException');
    } catch (IllegalArgumentException iaex) {
      System.Assert.areEqual(
        AsyncDmlBase.ERROR_RECORDS_REQUIRED,
        iaex.getMessage()
      );
    }

    Test.stopTest();
  }

  @IsTest
  static void it_should_throw_when_records_is_empty() {
    Test.startTest();

    try {
      sut.enqueue(new List<Account>());
      System.Assert.fail('Should throw IllegalArgumentException');
    } catch (IllegalArgumentException iaex) {
      System.Assert.areEqual(
        AsyncDmlBase.ERROR_RECORDS_REQUIRED,
        iaex.getMessage()
      );
    }

    Test.stopTest();
  }

  class AsyncDmlBaseStub extends AsyncDmlBase {
    public AsyncDmlBaseStub(DmlService dml) {
      super(dml);
    }

    public override void invokeDml() {
      dml.insertRecords(records);
    }
  }
}
