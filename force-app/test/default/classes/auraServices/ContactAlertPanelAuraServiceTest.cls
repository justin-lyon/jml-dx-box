@isTest
private class ContactAlertPanelAuraServiceTest {
  @TestSetup
  static void setupData() {
    Contact con = new Contact(LastName = 'Test');
    insert con;
    Alert__c alert = new Alert__c(
      Name = 'Test Alert',
      Type__c = 'Danger',
      Description__c = 'So dangerous.'
    );
    insert alert;

    ContactAlert__c ca = new ContactAlert__c(
      Contact__c = con.Id,
      Alert__c = alert.Id
    );
    insert ca;
  }

  static testMethod void getAlertsByAccount_givenAccountId_shouldGetAlerts() {
    Contact con = [SELECT Id FROM Contact LIMIT 1];

    Test.startTest();

    List<AlertModel> alerts = ContactAlertPanelAuraService.getAlertsByContact(
      con.Id
    );

    Test.stopTest();

    System.assert(!alerts.isEmpty());
  }
}
