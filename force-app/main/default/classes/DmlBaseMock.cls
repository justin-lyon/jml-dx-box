public abstract class DmlBaseMock implements DmlInterface {
	protected Map<Id, SObject> Records;
	public MockIdGenerator Builder;
	public Boolean IsSuccess = true;

	private static final String ID_FIELD = 'Id';
	private static final String FORCED_MESSAGE = 'Forced Exception from DmlBaseMock.';

	public DmlBaseMock(Map<Id, SObject> records, Schema.SObjectType objectType) {
		this.Records = records;
		this.Builder = new MockIdGenerator(objectType);
	}

	public List<SObject> getRecords() {
		return this.Records.values();
	}

	public void insertRecords(List<SObject> newRecords) {
		if (!IsSuccess) throw new DmlException(FORCED_MESSAGE);

		for (SObject record : newRecords) {
			if (record.get(ID_FIELD) != null) {
				throw new DmlException('Cannot insert a record with an ID.');
			}
			Id recordId = Builder.getMockId();
			record.put(ID_FIELD, recordId);
			this.Records.put((Id)recordId, record);
		}
	}

	public void updateRecords(List<SObject> records) {
		if (!IsSuccess) throw new DmlException(FORCED_MESSAGE);

		for (SObject record : records) {
			if (record.get(ID_FIELD) == null) {
				throw new DmlException('Records to update must have a record Id.');
			}
			this.Records.put((Id)record.get(ID_FIELD), record);
		}
	}

	public void upsertRecords(List<SObject> records) {
		if (!IsSuccess) throw new DmlException(FORCED_MESSAGE);

		for (SObject record : records) {
			if (record.get(ID_FIELD) == null) {
				Id recordId = Builder.getMockId();
				record.put(ID_FIELD, recordId);
			}
			this.Records.put((Id)record.get(ID_FIELD), record);
		}
	}

	public void deleteRecords(List<SObject> records) {
		if (!IsSuccess) throw new DmlException(FORCED_MESSAGE);

		for (SObject record : records) {
			if (record.get(ID_FIELD) == null) {
				throw new DmlException('Records to delete must have a record Id.');
			}
			this.Records.remove((Id)record.get(ID_FIELD));
		}
	}
}