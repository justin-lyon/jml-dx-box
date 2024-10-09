// prettier-ignore
public with sharing class PricebookSingleton {
  private static PricebookSingleton instance;
  private Id stdPricebookId = null;

  private PricebookSingleton() {}

  public static PricebookSingleton get() {
    if (instance == null) {
      instance = new PricebookSingleton();
    }
    return instance;
  }

  public Id getStdPricebookId() {
    if (stdPricebookId != null) {
      return stdPricebookId;
    }

    if (Test.isRunningTest()) {
      stdPricebookId = Test.getStandardPricebookId();
      return stdPricebookId;
    }

    stdPricebookId = queryStdPricebook().Id;
    return stdPricebookId;
  }

  private Pricebook2 queryStdPricebook() {
    return [
      SELECT Id
      FROM Pricebook2
      WHERE IsStandard = TRUE
      LIMIT 1
    ];
  }
}
