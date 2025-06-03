public with sharing class CollectionsUtil {
  public List<SObject> filterOwnerChanged(
    List<SObject> newRecords,
    Map<Id, SObject> oldRecords
  ) {
    List<SObject> ownerChanged = new List<SObject>();
    for (SObject newRecord : newRecords) {
      SObject oldRecord = oldRecords.get(getIdField(newRecord, 'Id'));
      final Id newOwnerId = getIdField(newRecord, 'OwnerId');
      final Id oldOwnerId = getIdField(oldRecord, 'OwnerId');
      if (
        newOwnerId != oldOwnerId &&
        newOwnerId.getSobjectType() == User.SObjectType
      ) {
        ownerChanged.add(newRecord);
      }
    }
    return ownerChanged;
  }

  public Set<Id> toSetOfId(List<SObject> records, final String idFieldName) {
    Set<Id> ids = new Set<Id>();
    for (SObject record : records) {
      Id recordId = getIdField(record, IdFieldName);
      ids.add(recordId);
    }
    return ids;
  }

  public Set<String> toSetOfString(
    List<SObject> records,
    final String fieldName
  ) {
    Set<String> items = new Set<String>();
    for (SObject record : records) {
      String item = getStringField(record, fieldName);
      items.add(item);
    }
    return items;
  }

  public Map<String, SObject> toMapByStringKey(
    List<SObject> records,
    final Schema.SObjectType objType,
    final String fieldName
  ) {
    Type mapType = Type.forName('Map<String, ' + String.valueOf(objType) + '>');
    Map<String, SObject> items = (Map<String, SObject>) mapType.newInstance();

    for (SObject record : records) {
      String key = getStringField(record, fieldName);
      items.put(key, record);
    }

    return items;
  }

  public Object[] slice(Object[] ary, Integer first, Integer last) {
    Object[] res = ary.clone(), temp; // NOPMD
    Integer size = ary.size(),
      startIndex = Math.min(
        size,
        Math.max(-1, first < 0 ? size + first : first)
      ),
      endIndex = Math.min(
        size,
        Math.max(-1, last < 0 ? size + last : last - 1)
      ),
      offset = Math.max(-1, endIndex - startIndex);
    temp = new List<Object>(offset + 1);

    for (Integer h = 0, i = startIndex, j = endIndex; i <= j;) {
      // NOPMD
      temp[h++] = ary[i++];
    }

    res.clear();
    res.addAll(temp);
    return res;
  }

  public List<String> toLowerCase(List<String> items) {
    List<String> lowerItems = new List<String>();
    for (String s : items) {
      lowerItems.add(s.toLowerCase());
    }
    return lowerItems;
  }

  private Id getIdField(SObject record, String fieldName) {
    return (Id) record.get(fieldName);
  }

  private String getStringField(SObject record, String fieldName) {
    return String.valueOf(record.get(fieldName));
  }
}
