public with sharing class AlertModel {
	@AuraEnabled
	public Id id {get; private set;}
	@AuraEnabled
	public String sobjectType {get; private set;}
	@AuraEnabled
	public Id alertId {get; private set;}
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
		alertId = aa.Alert__c;
		sobjectType = 'Alert__c';
	}

	public AlertModel(ContactAlert__c ca) {
		id = ca.Id;
		title = ca.Alert__r.Name;
		description = ca.Alert__r.Description__c;
		message = ca.Message__c;
		type = ca.Alert__r.Type__c;
		rank = Integer.valueOf(ca.Alert__r.Rank__c);
		alertId = ca.Alert__c;
		sobjectType = 'Alert__c';
	}
}
