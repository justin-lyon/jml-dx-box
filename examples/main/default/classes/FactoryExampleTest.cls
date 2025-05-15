@IsTest
private class FactoryExampleTest {
  static Mock factoryMock;
  static MethodSpy f_getDml;
  static MethodSpy f_getAccRepo;

  static Mock dmlMock;
  static Mock accMock;

  static MethodSpy dml_updateRecords;
  static MethodSpy ar_queryLimittedAccounts;

  static FactoryExample sut;

  static {
    factoryMock = Mock.forType(Factory.class);
    f_getDml = factoryMock.spyOn('getDML');
    f_getAccRepo = factoryMock.spyOn('getAccRepo');

    dmlMock = Mock.forType(DmlService.class);
    accMock = Mock.forType(AccountRepo.class);

    dml_updateRecords = dmlMock.spyOn('updateRecords');
    ar_queryLimittedAccounts = accMock.spyOn('queryLimittedAccounts');
    ar_queryLimittedAccounts.returns(
      new List<Account>{
        new Account(Name = 'Test Account 1', Description = 'Test Description 1')
      }
    );

    f_getDml.returns(dmlMock.stub);
    f_getAccRepo.returns(accMock.stub);
    Factory.factory = (Factory) factoryMock.stub;

    sut = new FactoryExample(Factory.factory);
    Expect.that(f_getDML).hasBeenCalledTimes(1);
    Expect.that(f_getAccRepo).hasBeenCalledTimes(1);
  }

  @IsTest
  static void it_should_run_happy_path() {
    sut.doSomething();

    Expect.that(ar_queryLimittedAccounts).hasBeenCalledTimes(1);
    Expect.that(ar_queryLimittedAccounts).hasBeenCalledWith(5);

    Expect.that(dml_updateRecords).hasBeenCalledTimes(1);
    Expect.that(dml_updateRecords)
      .hasBeenCalledWith(
        new List<Account>{
          new Account(
            Name = 'Test Account 1',
            Description = 'Test Description 1 - updated'
          )
        }
      );
  }
}
