public class ErrorProxy {
  public String message;
  public StatusCode statusCode;
  public List<String> fields;

  public ErrorProxy() {
  }

  public ErrorProxy(Database.Error err) {
    this.message = err.getMessage();
    this.statusCode = err.getStatusCode();
    this.fields = err.getFields();
  }
}
