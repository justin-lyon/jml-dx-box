public with sharing class AsyncDelete extends AsyncDmlBase {
  public AsyncDelete(DmlService dml) {
    super(dml);
  }

  public override void invokeDml() {
    dml.deleteRecords(records);
  }
}
