public with sharing class AccountAlertPanelAuraService {

	@AuraEnabled(cacheable=true)
	public static List<AlertModel> getAlertsByAccount(Id accountId) {
		List<AccountAlert__c> accountAlerts = [
			SELECT Id,
				Message__c,
				Alert__c,
				Alert__r.Type__c,
				Alert__r.Name,
				Alert__r.Description__c,
				Alert__r.Rank__c
			FROM AccountAlert__c
			WHERE Account__c = :accountId
				AND IsActive__c = true];

		List<AlertModel> alerts = new List<AlertModel>();
		for (AccountAlert__c aa : accountAlerts) {
			alerts.add(new AlertModel(aa));
		}
		return alerts;
	}
}