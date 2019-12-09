@isTest
private class AlertModelTest {

	@TestSetup
	static void setupData() {
		Account acc = new Account(Name = 'Test Account');
		insert acc;
		Contact con = new Contact(
			LastName = 'Test',
			AccountId = acc.Id);
		insert con;
		Alert__c alert = new Alert__c(
			Name = 'Test Alert',
			Type__c = 'Danger',
			Description__c = 'So dangerous.');
		insert alert;

		AccountAlert__c aa = new AccountAlert__c(
			Account__c = acc.Id,
			Alert__c = alert.Id);
		insert aa;

		ContactAlert__c ca = new ContactAlert__c(
			Contact__c = con.Id,
			Alert__c = alert.Id);
		insert ca;
	}

	static TestMethod void constructor_givenAccountAlert_shouldGetAlertModel() {
		AccountAlert__c aa = [
			SELECT Id,
				Alert__c,
				Alert__r.Name,
				Alert__r.Description__c,
				Alert__r.Type__c,
				Alert__r.Rank__c,
				Message__c
			FROM AccountAlert__c
			LIMIT 1];

		Test.startTest();

			AlertModel alert = new AlertModel(aa);

		Test.stopTest();

		System.assertNotEquals(null, alert);
	}

	static TestMethod void constructor_givenContactAlert_shouldGetAlertModel() {
		ContactAlert__c ca = [
			SELECT Id,
				Alert__c,
				Alert__r.Name,
				Alert__r.Description__c,
				Alert__r.Type__c,
				Alert__r.Rank__c,
				Message__c
			FROM ContactAlert__c
			LIMIT 1];

		Test.startTest();

			AlertModel alert = new AlertModel(ca);

		Test.stopTest();

		System.assertNotEquals(null, alert);
	}
}