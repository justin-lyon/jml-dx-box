public with sharing class ContactAlertPanelAuraService {

	@AuraEnabled(cacheable=true)
	public static List<AlertModel> getAlertsByContact(Id contactId) {
		List<ContactAlert__c> contactAlerts = [
			SELECT Id,
				Message__c,
				Alert__c,
				Alert__r.Type__c,
				Alert__r.Name,
				Alert__r.Description__c,
				Alert__r.Rank__c
			FROM ContactAlert__c
			WHERE Contact__c = :contactId
				AND IsActive__c = true];

		List<AlertModel> alerts = new List<AlertModel>();
		for (ContactAlert__c ca : contactAlerts) {
			alerts.add(new AlertModel(ca));
		}
		return alerts;
	}
}