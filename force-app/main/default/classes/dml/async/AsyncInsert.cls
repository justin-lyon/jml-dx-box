public with sharing class AsyncInsert extends AsyncDmlBase {
  public AsyncInsert(DmlService dml) {
    super(dml);
  }

  public override void invokeDml() {
    dml.insertRecords(records);
  }
}
