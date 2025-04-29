public with sharing class AsyncUpdate extends AsyncDmlBase {
  public AsyncUpdate(DmlService dml) {
    super(dml);
  }

  public override void invokeDml() {
    dml.updateRecords(records);
  }
}
