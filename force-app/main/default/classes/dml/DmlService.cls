public with sharing class DmlService {
  public void insertRecords(List<SObject> newRecords) {
    insert newRecords;
  }

  public void updateRecords(List<SObject> records) {
    update records;
  }

  public void upsertRecords(List<SObject> records) {
    upsert records;
  }

  public void deleteRecords(List<SObject> records) {
    delete records;
  }
}
