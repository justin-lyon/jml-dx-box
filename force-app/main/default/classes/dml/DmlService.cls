public with sharing class DmlService {
  public void insertRecords(List<SObject> newRecords) {
    insert newRecords;
  }

  public void updateRecords(List<SObject> records) {
    update records;
  }

  /**
   * @description Upsert a Collection of Records
   * @param List<SObject> records - The Collection to be upserted.
   * @example
   * public class MyClass extends DmlImpl {}
   * MyClass instance = new MyClass();
   * List<Account> accounts = new List<Account>();
   * instance.upsertRecords(accounts);
   */
  public void upsertRecords(List<SObject> records) {
    upsert records;
  }

  public void deleteRecords(List<SObject> records) {
    delete records;
  }
}
