public with sharing class AggregateResultProxy {
  private Map<String, Object> valuesByAlias = new Map<String, Object>();

  private AggregateResultProxy() {
  }

  public static AggregateResultProxy fromAggregateResult(AggregateResult item) {
    String itemJson = JSON.serialize(item);
    AggregateResultProxy proxy = new AggregateResultProxy();
    proxy.valuesByAlias = (Map<String, Object>) JSON.deserializeUntyped(
      itemJson
    );
    return proxy;
  }

  public static AggregateResultProxy fromMap(Map<String, Object> pairs) {
    AggregateResultProxy proxy = new AggregateResultProxy();
    proxy.valuesByAlias = new Map<String, Object>(pairs);
    return proxy;
  }

  public static AggregateResultProxy fromPair(String key, Object value) {
    AggregateResultProxy proxy = new AggregateResultProxy();
    proxy.valuesByAlias = new Map<String, Object>{ key => value };
    return proxy;
  }

  public Map<String, Object> getValuesByAlias() {
    return this.valuesByAlias;
  }
}
