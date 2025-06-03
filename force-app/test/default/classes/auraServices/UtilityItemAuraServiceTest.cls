@IsTest
private class UtilityItemAuraServiceTest {
  @IsTest
  static void getSObjectName_givenId_shouldGetStringName() {
    String sObjectName = '';

    Test.startTest();

    sObjectName = UtilityItemAuraService.getSObjectType('00100000000000a'); // NOPMD

    Test.stopTest();

    System.Assert.areEqual('Account', sObjectName);
  }
}
