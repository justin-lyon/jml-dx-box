/**
 * @description: Supports the lwc-lookup Lightning Web Component.
 */
public with sharing class LookupAuraService {
  /**
   * @description: Query a single record by ID.
   * @param searcher, describes the search term and its filters
   * @param recordId,
   * @return a JSON string of the queried record.
   */
  @AuraEnabled
  public static String getOneRecordById(Searchable searcher, Id recordId) {
    List<String> expr = new List<String>();
    expr.add('SELECT ' + String.join(searcher.fields, ', '));
    expr.add('FROM ' + String.escapeSingleQuotes(searcher.objectName));
    expr.add('WHERE Id = \'' + recordId + '\'');
    expr.add('LIMIT 1');

    String queryString = String.join(expr, ' ');
    System.debug('query string: ' + queryString);
    return JSON.serialize(Database.query(queryString));
  }

  /**
   * @description: Query recent records of a specific type.
   * @param searcher, describes the object type and fields to return.
   * @param recordId,
   * @return a JSON string of the queried records.
   */
  @AuraEnabled(cacheable=true)
  public static String getRecent(Searchable searcher) {
    Set<Id> recentIds = new Set<Id>();
    for (RecentlyViewed rv : queryRecentByType(searcher.objectName)) {
      recentIds.add(rv.Id);
    }

    List<String> expr = new List<String>();
    expr.add('SELECT ' + String.join(searcher.fields, ', '));
    expr.add('FROM ' + String.escapeSingleQuotes(searcher.objectName));
    expr.add(
      'WHERE Id IN (\'' + String.join(new List<Id>(recentIds), '\', \'') + '\')'
    );

    return JSON.serialize(Database.query(String.join(expr, ' ')));
  }

  /**
   * @description: Search for records across all fields of a specific object.
   * @param searcher, describes the search term and its filters.
   * @return a JSON string of the search results.
   */
  @AuraEnabled(cacheable=true)
  public static String getRecords(Searchable searcher) {
    String find =
      'FIND \'' +
      String.escapeSingleQuotes(searcher.searchTerm) +
      '*\' IN ALL FIELDS';
    String returning =
      'RETURNING ' + getReturning(searcher.objectName, searcher.fields);
    String limitter = 'LIMIT ' + 5;
    String query = find + ' ' + returning + ' ' + limitter;
    return JSON.serialize(System.Search.query(query));
  }

  private static String getReturning(String objectName, List<String> fields) {
    List<String> returning = new List<String>();
    String objectWithFields =
      objectName + (fields.isEmpty() ? '' : joinReturnFields(fields));
    returning.add(objectWithFields);
    return String.join(returning, ', ');
  }

  private static String joinReturnFields(List<String> fields) {
    return ' (' + String.escapeSingleQuotes(String.join(fields, ', ')) + ')';
  }

  private static List<RecentlyViewed> queryRecentByType(String objectName) {
    return [SELECT Id FROM RecentlyViewed WHERE Type = :objectName LIMIT 5];
  }

  /**
   * @description: A class to encapsulate the search parameters for querying records.
   */
  public class Searchable {
    @AuraEnabled
    public String searchTerm { get; set; }
    @AuraEnabled
    public String objectName { get; set; }
    @AuraEnabled
    public List<String> fields { get; set; }
  }
}
