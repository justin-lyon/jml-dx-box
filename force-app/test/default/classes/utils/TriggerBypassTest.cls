@isTest
private class TriggerBypassTest {
  static Mock bypassMock;
  static MethodSpy bm_getInstance;

  static {
    bypassMock = Mock.forType(TriggerBypassRepo.class);
    bm_getInstance = bypassMock.spyOn('getInstance');

    TriggerBypass__mdt bypass = new TriggerBypass__mdt();
    bypass.DeveloperName = 'Case';
    bypass.IsActive__c = true;
    bm_getInstance.returns(bypass);

    TriggerBypass.bypassDI = (TriggerBypassRepo) bypassMock.stub;
  }

  static testMethod void it_should_throw_when_not_found() {
    TriggerBypass__mdt bypass = new TriggerBypass__mdt();
    bypass.IsActive__c = false;
    bm_getInstance.throwsException(
      new TriggerBypass.TriggerBypassException('forced exception')
    );

    Boolean isSuccess = false;
    Test.startTest();

    try {
      TriggerBypass.isActive('anystring');
    } catch (TriggerBypass.TriggerBypassException tbex) {
      isSuccess = true;
    }

    Test.stopTest();

    System.assert(
      isSuccess,
      'Lack of metadata record should throw a TriggerBypassException.'
    );
  }

  static testMethod void it_should_return_isActive() {
    TriggerBypass__mdt bypass = new TriggerBypass__mdt();
    bypass.IsActive__c = true;
    bm_getInstance.returns(bypass);

    Test.startTest();

    Boolean isSuccess = TriggerBypass.isActive('triggerName');

    Test.stopTest();

    System.assert(isSuccess, 'The Case Trigger should be on.');
  }

  @IsTest
  static void it_should_rethrow_exception() {
    bm_getInstance.throwsException(new QueryException('forced exception'));

    Test.startTest();

    Boolean isSuccess = false;
    try {
      TriggerBypass.isActive('triggerName');
      System.Assert.fail();
    } catch (TriggerBypass.TriggerBypassException tbex) {
      isSuccess = true;
    }

    Test.stopTest();

    System.Assert.isTrue(
      isSuccess,
      'The exception should be rethrown as a TriggerBypassException.'
    );
  }
}
