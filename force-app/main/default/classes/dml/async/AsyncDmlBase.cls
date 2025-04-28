public abstract class AsyncDmlBase implements Actionable {
  public static final String ERROR_RECORDS_REQUIRED = 'Records cannot be null or empty';
  protected DmlService dml;
  protected List<SObject> records;

  protected AsyncDmlBase(DmlService dml) {
    this.dml = dml;
  }

  public void setRecords(List<SObject> records) {
    this.records = records;
  }

  protected void validate() {
    if (this.records == null || this.records.isEmpty()) {
      throw new IllegalArgumentException(ERROR_RECORDS_REQUIRED);
    }
  }
}
