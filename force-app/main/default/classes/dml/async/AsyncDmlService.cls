public with sharing class AsyncDmlService {
  public Id enqueue(Actionable item) {
    AsyncAction action = new AsyncAction(item);
    return System.enqueueJob(action);
  }
}
