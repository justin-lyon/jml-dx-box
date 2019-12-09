@isTest
private class UtilityItemAuraServiceTest {
	static TestMethod void getSObjectName_givenId_shouldGetStringName() {
		String sObjectName = '';

		Test.startTest();

			sObjectName = UtilityItemAuraService.getSObjectType('00100000000000a');

		Test.stopTest();

		System.assertEquals('Account', sObjectName);
	}
}