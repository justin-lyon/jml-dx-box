public abstract class AsyncDmlBase implements Actionable {
  public static final String ERROR_RECORDS_REQUIRED = 'Records cannot be null or empty';
  protected DmlService dml;
  protected List<SObject> records;

  protected AsyncDmlBase(DmlService dml) {
    this.dml = dml;
  }

  protected abstract void invokeDml();

  public void setRecords(List<SObject> records) {
    this.records = records;
  }

  public void call() {
    invokeDml();
  }

  public Id enqueue() {
    validate();

    AsyncAction action = new AsyncAction(this);
    return System.enqueueJob(action);
  }

  private void validate() {
    if (this.records == null || this.records.isEmpty()) {
      throw new IllegalArgumentException(ERROR_RECORDS_REQUIRED);
    }
  }
}
