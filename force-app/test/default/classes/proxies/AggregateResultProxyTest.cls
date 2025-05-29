@IsTest
private class AggregateResultProxyTest {
  @TestSetup
  static void setupData() {
    Account mitch = new Account(Name = 'Mitch Hedberg');
    Account segura = new Account(Name = 'Tom Segura');
    Account birbiglia = new Account(Name = 'Mike Birbiglia');
    insert new List<Account>{ mitch, segura, birbiglia };
  }

  @IsTest
  static void it_should_create_a_proxy_from_an_aggregate_result() {
    List<AggregateResult> results = [
      SELECT Name, COUNT(Id) total
      FROM Account
      GROUP BY Name
    ];

    Test.startTest();

    AggregateResultProxy proxy = AggregateResultProxy.fromAggregateResult(
      results[0]
    );

    Test.stopTest();

    System.Assert.isNotNull(proxy);
    System.Assert.areEqual(1, proxy.getValuesByAlias().get('total'));
  }

  @IsTest
  static void it_should_create_a_proxy_from_a_map() {
    Map<String, Object> pairs = new Map<String, Object>{
      'Name' => 'Mitch Hedberg',
      'total' => 1
    };

    Test.startTest();

    AggregateResultProxy proxy = AggregateResultProxy.fromMap(pairs);

    Test.stopTest();

    System.Assert.isNotNull(proxy);
    System.Assert.areEqual(1, proxy.getValuesByAlias().get('total'));
  }

  @IsTest
  static void it_should_create_a_proxy_from_a_pair() {
    Test.startTest();

    AggregateResultProxy proxy = AggregateResultProxy.fromPair(
      'Name',
      'Mitch Hedberg'
    );

    Test.stopTest();

    System.Assert.isNotNull(proxy);
    System.Assert.areEqual(
      'Mitch Hedberg',
      proxy.getValuesByAlias().get('Name')
    );
  }
}
