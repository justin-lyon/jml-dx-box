public with sharing class AsyncActionDemo {
  private DmlService dml;
  private AsyncInsert asyncInsert;

  public AsyncActionDemo(DmlService dml, Actionable asyncInsert) {
    this.dml = dml;
  }

  public void execute() {
    // Contact garbageMan = new Contact(LastName = 'Doe', FirstName = 'John');
    // List<Contact> contacts = new List<Contact>{ garbageMan };
    // Actionable asyncInsert = new AsyncInsert(dml, contacts);

    // AsyncAction insertLater = new AsyncAction(asyncInsert);
    // System.enqueueJob(insertLater);
  }
}
