public with sharing class AsyncInsert extends AsyncDmlBase {
  public AsyncInsert(DmlService dml) {
    super(dml);
  }

  public override void call() {
    super.validate();

    super.dml.insertRecords(super.records);
  }
}
