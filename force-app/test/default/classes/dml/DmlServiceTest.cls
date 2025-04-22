@IsTest
private class DmlServiceTest {
  static DmlService sut = new DmlService();

  static testMethod void insertRecords_givenAccount_shouldGetId() {
    Account acc = new Account(Name = 'Test Account');

    Test.startTest();

    sut.insertRecords(new List<Account>{ acc });

    Test.stopTest();

    System.Assert.areNotEqual(null, acc.Id);
  }

  static testMethod void updateRecords_givenAccount_shouldGetUpdatedAccount() {
    String oldAccountNumber = '123';
    String newAccountNumber = '456';

    Account acc = new Account(
      Name = 'Test Account',
      AccountNumber = oldAccountNumber
    );

    insert acc;

    acc.AccountNumber = newAccountNumber;

    Test.startTest();

    sut.updateRecords(new List<Account>{ acc });

    Test.stopTest();

    System.Assert.areNotEqual(null, acc.Id);
    Account updatedAccount = [
      SELECT AccountNumber
      FROM Account
      WHERE Id = :acc.Id
    ];

    System.Assert.areNotEqual(oldAccountNumber, updatedAccount.AccountNumber);
    System.Assert.areEqual(newAccountNumber, updatedAccount.AccountNumber);
  }

  static testMethod void upsertRecords_givenNewAccount_shouldGetId() {
    Account acc = new Account(Name = 'Test Account');

    Test.startTest();

    sut.upsertRecords(new List<Account>{ acc });

    Test.stopTest();

    System.Assert.areNotEqual(null, acc.Id);
  }

  static testMethod void deleteRecords_givenOldAccount_shouldGetNullID() {
    Account acc = new Account(Name = 'Test Account');

    insert acc;

    Test.startTest();

    sut.deleteRecords(new List<Account>{ acc });

    Test.stopTest();

    List<Account> accounts = [SELECT Id FROM Account];
    System.Assert.isTrue(accounts.isEmpty());
  }
}
