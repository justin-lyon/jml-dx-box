@IsTest
private class AccountRepoTest {
  private static String ACCOUNT_ID1;
  private static String ACCOUNT_ID2;
  private static String ACCOUNT_ID3;

  @IsTest
  static void it_should_return_a_list_by_ids() {
    setupAccounts();
    Set<Id> accountIds = new Set<Id>{ ACCOUNT_ID1, ACCOUNT_ID2 };

    Test.startTest();

    List<Account> accounts = new AccountRepo().queryByIds(accountIds);

    Test.stopTest();

    System.Assert.areEqual(2, accounts.size());
    System.Assert.areEqual(ACCOUNT_ID1, accounts[0].Id);
    System.Assert.areEqual(ACCOUNT_ID2, accounts[1].Id);
  }

  @IsTest
  static void it_should_query_any_but_limited() {
    setupAccounts();
    Integer limitter = 2;

    Test.startTest();

    List<Account> accounts = new AccountRepo().queryLimittedAccounts(limitter);

    Test.stopTest();

    System.Assert.areEqual(limitter, accounts.size());
  }

  @IsTest
  static void it_should_sosl_search_accounts_by_term() {
    setupAccounts();
    List<Id> searchResultsIds = new List<Id>{ ACCOUNT_ID3 };
    Test.setFixedSearchResults(searchResultsIds);
    String searchString = 'Chrono Trigger';

    Test.startTest();

    List<Account> accounts = new AccountRepo().searchAccounts(searchString);

    Test.stopTest();

    System.Assert.areEqual(1, accounts.size());
    System.Assert.areEqual(ACCOUNT_ID3, accounts[0].Id);
    System.Assert.areEqual('Chrono Trigger', accounts[0].Name);
  }

  private static void setupAccounts() {
    Account a1 = TestUtil.createAccount('Age of Empires');
    Account a2 = TestUtil.createAccount('Bastion');
    Account a3 = TestUtil.createAccount('Chrono Trigger');
    insert new List<Account>{ a1, a2, a3 };

    ACCOUNT_ID1 = a1.Id;
    ACCOUNT_ID2 = a2.Id;
    ACCOUNT_ID3 = a3.Id;
  }
}
