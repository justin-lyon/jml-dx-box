public with sharing class AsyncUpsert extends AsyncDmlBase {
  public AsyncUpsert(DmlService dml) {
    super(dml);
  }

  public override void invokeDml() {
    dml.upsertRecords(records);
  }
}
