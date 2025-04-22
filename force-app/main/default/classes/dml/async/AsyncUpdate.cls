public with sharing class AsyncUpdate implements Actionable {
  private DmlService dml;
  private List<SObject> records;

  public AsyncUpdate(DmlService dml, List<SObject> records) {
    this.dml = dml;
    this.records = records;
  }

  public void call() {
    this.dml.updateRecords(this.records);
  }
}
