public with sharing class SaveResultProxy {
  public Boolean success;
  public Id id;
  public List<ErrorProxy> errors;

  private SaveResultProxy() {
  }

  public static SaveResultProxy fromDBSaveResult(Database.SaveResult sr) {
    SaveResultProxy proxy = new SaveResultProxy();
    proxy.success = sr.isSuccess();
    proxy.id = sr.getId();
    proxy.errors = new List<ErrorProxy>();

    for (Database.Error err : sr.getErrors()) {
      proxy.errors.add(ErrorProxy.fromDBError(err));
    }
    return proxy;
  }
}
