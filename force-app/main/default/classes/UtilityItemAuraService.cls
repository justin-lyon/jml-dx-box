public with sharing class UtilityItemAuraService {
	@AuraEnabled(cacheable=true)
	public static String getSObjectType(Id recordId){
		return String.valueOf(Toolbox.getSObjectType(recordId));
	}
}