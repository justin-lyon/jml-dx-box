public with sharing class SaveResultProxy {
  public Boolean success;
  public Id id;
  public List<ErrorProxy> errors;

  public SaveResultProxy() {
  }

  public SaveResultProxy(Database.SaveResult sr) {
    success = sr.isSuccess();
    id = sr.getId();
    this.errors = new List<ErrorProxy>();

    for (Database.Error err : sr.getErrors()) {
      this.errors.add(new ErrorProxy(err));
    }
  }

  public Database.SaveResult toSaveResult() {
    String resultStr = JSON.serialize(this);
    return (Database.SaveResult) JSON.deserialize(
      resultStr,
      Database.SaveResult.class
    );
  }
}
