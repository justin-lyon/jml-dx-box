public with sharing class AccountRepo {
  public static final Integer MAX_RESULTS = 5;

  public List<Account> queryByIds(Set<Id> accountIds) {
    return [
      SELECT Id, OwnerId
      FROM Account
      WHERE Id IN :accountIds
    ];
  }

  public List<Account> queryLimittedAccounts(Integer limitter) {
    limitter = Integer.valueOf(limitter);
    return [
      SELECT Id, Name
      FROM Account
      ORDER BY CreatedDate ASC
      LIMIT :limitter
    ];
  }

  public List<Account> searchAccounts(String searchString) {
    String escapedTerm = String.escapeSingleQuotes(searchString) + '*';

    List<List<SObject>> results = [
      FIND :escapedTerm
      IN ALL FIELDS
      RETURNING Account(Id, Name)
      LIMIT :MAX_RESULTS
    ];

    return results[0];
  }
}
