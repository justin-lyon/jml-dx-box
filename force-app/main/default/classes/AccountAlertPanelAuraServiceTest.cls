@isTest
private class AccountAlertPanelAuraServiceTest {
  @TestSetup
  static void setupData() {
    Account acc = new Account(Name = 'Test Account');
    insert acc;
    Alert__c alert = new Alert__c(
      Name = 'Test Alert',
      Type__c = 'Danger',
      Description__c = 'So dangerous.'
    );
    insert alert;

    AccountAlert__c aa = new AccountAlert__c(
      Account__c = acc.Id,
      Alert__c = alert.Id
    );
    insert aa;
  }

  @isTest
  static void getAlertsByAccount_givenAccountId_shouldGetAlerts() {
    Account acc = [SELECT Id FROM Account LIMIT 1];

    Test.startTest();

    List<AlertModel> alerts = AccountAlertPanelAuraService.getAlertsByAccount(
      acc.Id
    );

    Test.stopTest();

    System.assert(!alerts.isEmpty());
  }
}
