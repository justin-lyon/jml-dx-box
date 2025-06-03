@IsTest
private class PricebookSingletonTest {
  @IsTest
  static void it_should_return_pricebook_id() {
    PricebookSingleton instance = PricebookSingleton.get();

    Test.startTest();

    Id stdPricebookId = instance.getStdPricebookId();

    Test.stopTest();

    Id expected = Test.getStandardPricebookId();
    System.Assert.areEqual(
      expected,
      stdPricebookId,
      'Expecting the SF Test Standard Pricebook Id.'
    );
  }

  @IsTest
  static void it_should_read_private_member_on_second_get() {
    PricebookSingleton instance = PricebookSingleton.get();
    Id stdPricebookId = instance.getStdPricebookId();

    Test.startTest();

    Id secondPricebookId = instance.getStdPricebookId();

    Test.stopTest();

    Id expected = Test.getStandardPricebookId();
    System.Assert.areEqual(
      expected,
      secondPricebookId,
      'Expecting the SF Test Standard Pricebook Id.'
    );
  }

  @IsTest
  static void it_should_get_the_same_instance() {
    PricebookSingleton instance1 = PricebookSingleton.get();
    PricebookSingleton instance2 = PricebookSingleton.get();

    Test.startTest();

    Integer hash1 = System.hashCode(instance1);
    Integer hash2 = System.hashCode(instance2);

    Test.stopTest();

    System.Assert.areEqual(hash1, hash2);
  }
}
