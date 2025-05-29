public class ErrorProxy {
  public String message;
  public StatusCode statusCode;
  public List<String> fields;

  private ErrorProxy() {
  }

  public static ErrorProxy fromDBError(Database.Error err) {
    ErrorProxy proxy = new ErrorProxy();
    proxy.message = err.getMessage();
    proxy.statusCode = err.getStatusCode();
    proxy.fields = err.getFields();
    return proxy;
  }
}
