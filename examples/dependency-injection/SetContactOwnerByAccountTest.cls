@IsTest
private class SetContactOwnerByAccountTest {
  private static final Id ACCOUNT_ID;
  private static final Id OWNER_ID;

  // Define the Mock and the Spy that I'll be using.
  static Mock accRepo;
  static MethodSpy ar_queryByIds;

  // This is the class that I'm testing.
  static SetContactOwnerByAccount sut;

  static {
    // Initialize these constants so we can assert against them later.
    ACCOUNT_ID = MockIdGenerator.getMockId(Account.getSObjectType());
    OWNER_ID = MockIdGenerator.getMockId(User.getSObjectType());

    // The fake Account that will be returned by the mocked AccountRepo.
    Account acc = TestUtil.createAccount('TestAccount');
    acc.Id = ACCOUNT_ID;
    acc.OwnerId = OWNER_ID;

    // Using apex-mockery to initialize the Mock and Spy.
    accRepo = Mock.forType(AccountRepo.class);
    // Perhaps the greatest weakness is requiring a String for the method name.
    ar_queryByIds = accRepo.spyOn('queryByIds');
    // Telling the Mock exactly what we want it to return.
    ar_queryByIds.returns(new List<Account>{ acc });

    // Injecting the Mock to the System Under Test.
    sut = new SetContactOwnerByAccount((AccountRepo) accRepo.stub);
  }

  @IsTest
  static void it_should_NOT_set_ownerid_when_contact_does_NOT_have_accountid() {
    Contact noAccount = TestUtil.createContact('NoAccount');

    Test.startTest();

    sut.execute(new List<Contact>{ noAccount });

    Test.stopTest();

    // Using apex-mockery to Expect that my mock method was called exactly once.
    Expect.that(ar_queryByIds).hasBeenCalledTimes(1);
    // Using apex-mockery to Expect that my mock method was called
    // with a specific argument.
    Expect.that(ar_queryByIds).hasBeenCalledWith(new Set<Id>{ null });

    // Using standard apex asserts only after I have passed
    // the apex-mockery Expects.
    // If my methods aren't called the way I expect, then these Asserts
    // on the data are worthless.
    System.Assert.isNull(
      noAccount.OwnerId,
      'OwnerId should be null because there is no AccountId.'
    );
  }

  @IsTest
  static void it_should_NOT_set_ownerid_when_contact_accountid_is_not_found() {
    Contact accountNotFound = TestUtil.createContact('accountNotFound');
    accountNotFound.AccountId = MockIdGenerator.getMockId(
      Account.getSObjectType()
    );

    Test.startTest();

    sut.execute(new List<Contact>{ accountNotFound });

    Test.stopTest();

    Expect.that(ar_queryByIds).hasBeenCalledTimes(1);
    Expect.that(ar_queryByIds)
      .hasBeenCalledWith(new Set<Id>{ accountNotFound.AccountId });

    System.Assert.isNull(
      accountNotFound.OwnerId,
      'OwnerId should be null because there is no Account found using the Contact\'s AccountId.'
    );
  }

  @IsTest
  static void it_should_set_ownerid_when_contact_has_accountid() {
    Contact withAccount = TestUtil.createContact('WithAccount');
    withAccount.AccountId = ACCOUNT_ID;

    Test.startTest();

    sut.execute(new List<Contact>{ withAccount });

    Test.stopTest();

    Expect.that(ar_queryByIds).hasBeenCalledTimes(1);
    Expect.that(ar_queryByIds).hasBeenCalledWith(new Set<Id>{ ACCOUNT_ID });

    System.Assert.areEqual(OWNER_ID, withAccount.OwnerId);
  }

  @IsTest
  static void it_should_default_construct() {
    Test.startTest();

    sut = new SetContactOwnerByAccount();

    Test.stopTest();

    System.Assert.isNotNull(sut);
  }
}
