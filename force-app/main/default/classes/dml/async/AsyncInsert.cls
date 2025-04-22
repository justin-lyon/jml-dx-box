public with sharing class AsyncInsert implements Actionable {
  private DmlService dml;
  private List<SObject> records;

  public AsyncInsert(DmlService dml, List<SObject> records) {
    this.dml = dml;
    this.records = records;
  }

  public void call() {
    this.dml.insertRecords(this.records);
  }
}
