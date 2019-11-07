public with sharing class AccountAlertsPanelAuraService {

	@AuraEnabled
	public static List<AlertModel> getAlertsByAccount(Id accountId) {
		List<AccountAlert__c> accountAlerts = [
			SELECT Id,
				Message__c,
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

	public class AlertModel {
		@AuraEnabled
		public Id id {get; private set;}
		@AuraEnabled
		public String title {get; private set;}
		@AuraEnabled
		public String description {get; private set;}
		@AuraEnabled
		public String message {get; private set;}
		@AuraEnabled
		public String type {get; private set;}
		@AuraEnabled
		public Integer rank {get; private set;}

		public AlertModel(AccountAlert__c aa) {
			id = aa.Id;
			title = aa.Alert__r.Name;
			description = aa.Alert__r.Description__c;
			message = aa.Message__c;
			type = aa.Alert__r.Type__c;
			rank = Integer.valueOf(aa.Alert__r.Rank__c);
		}
	}
}
