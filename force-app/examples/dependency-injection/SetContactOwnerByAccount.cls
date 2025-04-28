public with sharing class SetContactOwnerByAccount {
  // The dependency to be injected.
  private AccountRepo accRepo;

  private CollectionsUtil cutil = new CollectionsUtil();

  public SetContactOwnerByAccount() {
    // Usually it uses a regular AccountRepo.
    this(new AccountRepo());
  }

  public SetContactOwnerByAccount(AccountRepo accRepo) {
    // This constructor is how a test can "Inject" a mock.
    this.accRepo = accRepo;
  }

  public void execute(List<Contact> contacts) {
    Set<Id> accountIds = cutil.toSetOfId(contacts, 'AccountId');
    Map<Id, Account> accountsById = new Map<Id, Account>(
      // Here the dependency is used to query accounts by id.
      // We'll have to mock this in a test.
      accRepo.queryByIds(accountIds)
    );

    for (Contact con : contacts) {
      Id accountId = con.AccountId;

      // I can hit this path by passing in a Contact with no AccountId.
      // I don't need Dependency Injection to test this.
      if (String.isBlank(accountId)) {
        continue;
      }

      // I can hit this path by passing in a Contact with an AccountId
      // that doesn't exist.
      // Dependency Injection makes this trivial.
      if (!accountsById.containsKey(accountId)) {
        continue;
      }

      // This is the happy path where I have a Contact with an AccountId
      // that exists.
      // Dependency Injection makes this much easier to test because I
      // am creating the Account and the Contact together in my test.
      Account parent = accountsById.get(accountId);
      con.OwnerId = parent.OwnerId;
    }
  }
}
