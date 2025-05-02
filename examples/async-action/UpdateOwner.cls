public with sharing class UpdateOwner {
  private DmlService dml;
  private AsyncDmlBase asyncUpdate;

  public UpdateOwner() {
    this(new DmlService());
  }

  public UpdateOwner(DmlService dml) {
    this(dml, new AsyncUpdate(dml));
  }

  public UpdateOwner(DmlService dml, AsyncUpdate asyncUpdate) {
    this.dml = dml;
    this.asyncUpdate = asyncUpdate;
  }

  public void execute(Account acc) {
    acc.Description = 'Updated';

    User owner = new User(Id = acc.OwnerId);
    owner.CompanyName = acc.Name;

    dml.updateRecords(new List<SObject>{ acc });

    asyncUpdate.enqueue(new List<SObject>{ owner });
  }
}
