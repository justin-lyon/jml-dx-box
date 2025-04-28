@IsTest
private class CollectionsUtilTest {
  private static CollectionsUtil sut;
  static {
    sut = new CollectionsUtil();
  }

  @IsTest
  static void filterOwnerChanged_givenSObjects_shouldReturnSObjectsWithOwnerChanges() {
    User u1 = new User(Id = MockIdGenerator.getMockId(User.SObjectType));
    User u2 = new User(Id = MockIdGenerator.getMockId(User.SObjectType));

    Id acc1Id = MockIdGenerator.getMockId(Account.SObjectType);
    Id acc2Id = MockIdGenerator.getMockId(Account.SObjectType);
    Account newA1 = TestUtil.createAccount('A1');
    newA1.Id = acc1Id;
    newA1.OwnerId = u1.Id;
    Account oldA1 = TestUtil.createAccount('A1');
    oldA1.Id = acc1Id;
    oldA1.OwnerId = u2.Id;

    Account newA2 = TestUtil.createAccount('A2');
    newA2.Id = acc2Id;
    newA2.OwnerId = u1.Id;
    Account oldA2 = TestUtil.createAccount('A2');
    oldA2.Id = acc2Id;
    oldA2.OwnerId = u1.Id;

    List<Account> newAccounts = new List<Account>{ newA1, newA2 };
    Map<Id, Account> oldAccounts = new Map<Id, Account>(
      new List<Account>{ oldA1, oldA2 }
    );

    Test.startTest();

    List<Account> ownerChanged = sut.filterOwnerChanged(
      newAccounts,
      oldAccounts
    );

    Test.stopTest();

    System.Assert.areEqual(1, ownerChanged.size());
    Account result = ownerChanged.get(0);
    System.Assert.areEqual(acc1Id, result.Id);
  }

  @IsTest
  static void toSetOfId_givenList_shouldReturnSet() {
    Account acc = TestUtil.createAccount('Chester Bennington');
    acc.Id = MockIdGenerator.getMockId(Account.SObjectType);

    Test.startTest();

    Set<Id> accountIds = sut.toSetOfId(new List<Account>{ acc }, 'Id');

    Test.stopTest();

    System.Assert.areEqual(1, accountIds.size());
    System.Assert.isTrue(accountIds.contains(acc.Id));
  }

  @IsTest
  static void toSetOfString_givenList_shouldReturnSet() {
    List<String> scifi = new List<String>{
      'Star Trek',
      'Star Wars',
      'Firefly',
      'The Expanse',
      'Firefly'
    };
    List<Account> accounts = new List<Account>();
    for (String title : scifi) {
      accounts.add(new Account(Name = title));
    }

    Test.startTest();

    Set<String> names = sut.toSetOfString(accounts, 'Name');

    Test.stopTest();

    System.Assert.areEqual(4, names.size());
    System.Assert.isTrue(names.contains('Firefly'));
  }

  @IsTest
  static void slice_givenListAccount_shouldReturnSubArray() {
    List<Account> accounts = new List<Account>();
    accounts.add(new Account(Name = '1'));
    accounts.add(new Account(Name = '2'));
    accounts.add(new Account(Name = '3'));

    Test.startTest();

    List<Account> sliced = (List<Account>) sut.slice(accounts, 1, 2);

    Test.stopTest();

    System.Assert.areEqual(1, sliced.size());
    Account acc = sliced.get(0);
    System.Assert.areEqual('2', acc.Name);
  }

  @IsTest
  static void slice_givenListString_shouldReturnSubArray() {
    List<String> books = new List<String>{
      'Foundation',
      'The Expanse',
      'Dresden Files',
      'The Lord of the Rings',
      'Clean Code'
    };

    Test.startTest();

    List<String> sliced = (List<String>) sut.slice(books, 0, 2);

    Test.stopTest();

    System.Assert.areEqual(2, sliced.size());
    Set<String> titles = new Set<String>(sliced);
    System.Assert.isTrue(titles.contains('Foundation'));
    System.Assert.isTrue(titles.contains('The Expanse'));
  }

  @IsTest
  static void slice_givenListInteger_shouldReturnSubArray() {
    List<Integer> numbers = new List<Integer>{ 1, 2, 3, 5, 8, 13, 21, 34, 55 };
    Test.startTest();

    List<Integer> sliced = (List<Integer>) sut.slice(numbers, 4, 7);

    Test.stopTest();

    System.Assert.areEqual(3, sliced.size());
    Set<Integer> numberSet = new Set<Integer>(sliced);
    System.Assert.isTrue(numberSet.contains(8));
    System.Assert.isTrue(numberSet.contains(13));
    System.Assert.isTrue(numberSet.contains(21));
  }

  @IsTest
  static void slice_givenBigList_shouldReturnChunk() {
    List<Integer> bigList = new List<Integer>();
    for (Integer i = 0; i < 1000; i++) {
      bigList.add(i);
    }

    Test.startTest();

    List<Integer> toProcess = (List<Integer>) sut.slice(bigList, 0, 200);
    List<Integer> toForward = (List<Integer>) sut.slice(
      bigList,
      200,
      bigList.size()
    );

    Test.stopTest();

    System.Assert.areEqual(bigList.size(), toProcess.size() + toForward.size());
  }

  @IsTest
  static void slice_givenEndIndexTooLong_shouldReturnSelectionUpToListSize() {
    List<Integer> numbers = new List<Integer>{ 1, 2, 3 };

    Integer length = numbers.size();
    Integer chunkSize = 200;
    Integer sliceUpperBound = length > chunkSize ? chunkSize : length;
    Test.startTest();

    List<Integer> sliced = (List<Integer>) sut.slice(
      numbers,
      0,
      sliceUpperBound
    );

    Test.stopTest();

    System.Assert.areEqual(3, sliced.size());
  }

  @IsTest
  static void toMapByStringKey_givenListOfType_shouldReturnMapOfType() {
    Product2 p1 = new Product2();
    p1.Name = 'test product 1';
    p1.ProductCode = 'tp1';
    Product2 p2 = new Product2();
    p2.Name = 'test product 2';
    p2.ProductCode = 'tp2';
    List<Product2> products = new List<Product2>{ p1, p2 };

    Test.startTest();

    Map<String, Product2> productsByCode = (Map<String, Product2>) sut.toMapByStringKey(
      products,
      Product2.getSObjectType(),
      'ProductCode'
    );

    Test.stopTest();

    System.Assert.isNotNull(productsByCode);
    System.Assert.areEqual('test product 1', productsByCode.get('tp1').Name);
    System.Assert.areEqual('test product 2', productsByCode.get('tp2').Name);
  }

  @IsTest
  static void toLowerCase_givenAllCaps_shouldReturnLowerCase() {
    List<String> caps = new List<String>{ 'ONE' };
    Test.startTest();

    List<String> actual = sut.toLowerCase(caps);

    Test.stopTest();

    System.Assert.areNotEqual(caps, actual);
    System.Assert.areEqual(1, actual.size());
    System.Assert.areEqual('one', actual.get(0));
  }
}
