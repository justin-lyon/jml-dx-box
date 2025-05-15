public with sharing class FactoryExample {
  private DmlService dml;
  private AccountRepo accRepo;

  public FactoryExample() {
    this(Factory.getFactory());
  }

  public FactoryExample(Factory factory) {
    this.dml = factory.getDML();
    this.accRepo = factory.getAccRepo();
  }

  public void doSomething() {
    List<Account> accounts = accRepo.queryLimittedAccounts(5);

    for (Account acc : accounts) {
      acc.Description = acc.Description + ' - updated';
    }

    dml.updateRecords(accounts);
  }
}
