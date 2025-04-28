public with sharing class AsyncUpdate extends AsyncDmlBase implements Actionable {
  public AsyncUpdate(DmlService dml) {
    super(dml);
  }

  public void call() {
    super.validate();

    super.dml.updateRecords(super.records);
  }
}
