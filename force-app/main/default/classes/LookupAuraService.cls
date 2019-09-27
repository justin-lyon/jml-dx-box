public with sharing class LookupAuraService {

	@AuraEnabled(cacheable=true)
	public static String getRecords(Searchable searcher) {
		System.debug(searcher.searchTerm);
		System.debug(searcher.fieldsByObject);
		String find = 'FIND\'' + searcher.searchTerm + '*\' IN ALL FIELDS';
		String returning = 'RETURNING ' + getReturning(searcher.fieldsByObject);
		String limitter = 'LIMIT ' + 5;
		String query = find + ' ' + returning + ' ' + limitter;
		return JSON.serialize(searchRecords(query));
	}

	private static List<List<SObject>> searchRecords(String soslString) {
		return search.query(soslString);
	}

	private static String getReturning(Map<String, List<String>> fieldsByObject) {
		List<String> returning = new List<String>();
		for (String objKey : fieldsByObject.keySet()) {
			List<String> fields = fieldsByObject.get(objKey);
			String objectWithFields = objKey + (fields.isEmpty() ? '' : joinReturnFields(fields));
			returning.add(objectWithFields);
		}
		return String.join(returning, ', ');
	}

	private static String joinReturnFields(List<String> fields) {
		return ' (' + String.escapeSingleQuotes(String.join(fields, ', ')) + ')';
	}

	public class Searchable {

		@AuraEnabled
		public String searchTerm {get;set;}
		@AuraEnabled
		public Map<String, List<String>> fieldsByObject {get;set;}
	}
}
