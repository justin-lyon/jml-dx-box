public class AsyncAction implements Queueable, Database.AllowsCallouts {
  private Actionable item;
  private final String originalTransactionId;

  public AsyncAction(Actionable item) {
    this(item, Nebula.Logger.getTransactionId());
  }

  public AsyncAction(Actionable item, final String transactionId) {
    this.item = item;
    this.originalTransactionId = transactionId;
  }

  public void execute(QueueableContext ctx) {
    Nebula.Logger.setParentLogTransactionId(originalTransactionId);

    try {
      item.call();
    } catch (Exception exc) {
      Nebula.Logger.error('An Unhandled Exception occurred', exc)
        .addTag('Async');
    }

    Nebula.Logger.saveLog();
  }
}
