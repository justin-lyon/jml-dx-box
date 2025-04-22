@IsTest
private class AsyncActionTest {
  private static final String TRANSACTION_ID;

  static Mock actionableMock;
  static MethodSpy action_call;
  static AsyncAction sut;

  static {
    TRANSACTION_ID = Nebula.Logger.getTransactionId();

    actionableMock = Mock.forType(Actionable.class);
    action_call = actionableMock.spyOn('call');

    sut = new AsyncAction((Actionable) actionableMock.stub, TRANSACTION_ID);
  }

  @IsTest
  static void it_should_not_log_error_on_success() {
    Test.startTest();

    Id jobId = System.enqueueJob(sut);

    Test.stopTest();

    List<Nebula__LogEntry__c> entries = queryLogEntry(TRANSACTION_ID);
    System.Assert.isTrue(
      entries.isEmpty(),
      'Should be no Error entries on success'
    );

    AsyncApexJob job = queryJobById(jobId);
    System.Assert.isNotNull(job);
    System.Assert.areEqual('Completed', job.Status);
  }

  @IsTest
  static void it_should_log_an_error_on_exception() {
    action_call.throwsException(new DmlException('Forced Exception'));

    Test.startTest();

    Id jobId = System.enqueueJob(sut);

    Test.stopTest();

    List<Nebula__LogEntry__c> entries = queryLogEntry(TRANSACTION_ID);
    System.Assert.areEqual(
      1,
      entries.size(),
      'Should record 1 error log entry for the DML Exception.'
    );

    AsyncApexJob job = queryJobById(jobId);
    System.Assert.isNotNull(job);
    System.Assert.areEqual('Completed', job.Status);
  }

  private static List<Nebula__LogEntry__c> queryLogEntry(String transactionId) {
    return [
      SELECT Id
      FROM Nebula__LogEntry__c
      WHERE
        Nebula__LogTransactionId__c = :transactionId
        AND Nebula__LoggingLevel__c = 'ERROR'
    ];
  }

  private static AsyncApexJob queryJobById(Id jobId) {
    return [
      SELECT Id, Status, NumberOfErrors
      FROM AsyncApexJob
      WHERE Id = :jobId
      LIMIT 1
    ];
  }
}
