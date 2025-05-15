public with sharing class Factory {
  private DmlService DML;

  private AccountRepo AccRepo;
  private TriggerBypassRepo TriggerBypassRepo;

  @TestVisible
  private static Factory factory;

  private Factory() {
  }

  public static Factory getFactory() {
    if (factory == null) {
      factory = new Factory();
    }
    return factory;
  }

  /**
   * GETTERS
   */
  public DmlService getDML() {
    if (DML == null) {
      DML = new DmlService();
    }
    return DML;
  }

  public AccountRepo getAccRepo() {
    if (AccRepo == null) {
      AccRepo = new AccountRepo();
    }
    return AccRepo;
  }

  public TriggerBypassRepo getTriggerBypassRepo() {
    if (TriggerBypassRepo == null) {
      TriggerBypassRepo = new TriggerBypassRepo();
    }
    return TriggerBypassRepo;
  }
}
