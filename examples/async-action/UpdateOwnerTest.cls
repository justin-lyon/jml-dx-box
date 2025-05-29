@IsTest
private class UpdateOwnerTest {
  static Mock dml;
  static Mock asyncUpdate;

  static MethodSpy dml_updateRecords;
  static MethodSpy asyncUpdate_enqueue;

  static UpdateOwner sut;

  static {
    dml = Mock.forType(DmlService.class);
    asyncUpdate = Mock.forType(AsyncUpdate.class);

    dml_updateRecords = dml.spyOn('updateRecords');
    asyncUpdate_enqueue = asyncUpdate.spyOn('enqueue');

    sut = new UpdateOwner(
      (DmlService) dml.stub,
      (AsyncUpdate) asyncUpdate.stub
    );
  }

  @IsTest
  static void it_should_construct() {
    UpdateOwner item = new UpdateOwner();

    System.Assert.isNotNull(item);
  }

  @IsTest
  static void it_should_call_dependencies() {
    Account acc = new Account(
      Name = 'Test Account',
      OwnerId = UserInfo.getUserId()
    );

    sut.execute(acc);

    Expect.that(dml_updateRecords).hasBeenCalledTimes(1);
    Expect.that(dml_updateRecords).hasBeenCalledWith(new List<SObject>{ acc });

    Expect.that(asyncUpdate_enqueue).hasBeenCalledTimes(1);
    Expect.that(asyncUpdate_enqueue)
      .hasBeenCalledWith(
        new List<SObject>{ new User(Id = acc.OwnerId, CompanyName = acc.Name) }
      );

    System.Assert.areEqual('Updated', acc.Description);
  }
}
