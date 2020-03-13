public class ToolBox {
	private static List<String> hexMap;
	static {
		hexMap = new List<String> {
			'0', '1', '2', '3', '4', '5', '6', '7',
			'8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
		};
	}

	public static Schema.SObjectType getSObjectType(String objectName) {
		return Schema.getGlobalDescribe().get(objectName);
	}

	public static Schema.SObjectType getSObjectType(Id recordId) {
		return recordId.getSobjectType();
	}

	public static Id getRecordTypeId(String objectName, String recordTypeDeveloperName) {
		Schema.SObjectType objectType = getSObjectType(objectName);
		return objectType.getDescribe().getRecordTypeInfosByDeveloperName().get(recordTypeDeveloperName).getRecordTypeId();
	}

	public static Map<String, Id> getRecordTypeIdsByObject(String objectName) {
		Map<String, Id> recordTypesByDeveloperName = new Map<String, Id>();
		for(Schema.RecordTypeInfo info : getSObjectType(objectName).getDescribe().getRecordTypeInfosByDeveloperName().values()) {
			recordTypesByDeveloperName.put(info.getName(), info.getRecordTypeId());
		}
		return recordTypesByDeveloperName;
	}

	public static List<Schema.PicklistEntry> getPicklistEntries(String objectName, String fieldName) {
		Schema.DescribeSObjectResult objectDescribe = getSObjectType(objectName).getDescribe();
		return objectDescribe.Fields.getMap().get(fieldName).getDescribe().getPicklistValues();
	}

	public static String generateUUID() {
		// Create a Version 4 UUID
		// https://salesforce.stackexchange.com/a/223381
		String randomStringAsHex = EncodingUtil.convertToHex(Crypto.generateAesKey(128));

		String versionHexBits = randomStringAsHex.substring(14, 16); // 7th bit
		String variantHexBits = randomStringAsHex.substring(18, 20); // 9th bit

		Integer versionIntBits = convertHexToInt(versionHexBits);
		Integer variantIntBits = convertHexToInt(variantHexBits);

		Integer versionShiftedIntBits = versionIntBits & 15 | 64; // (i & 0x0f) | 0x40
		Integer variantShiftedIntBits = variantIntBits & 63 | 128; // (i & 0x3f) | 0x80

		String versionShiftedHexBits = convertIntToHex(versionShiftedIntBits); // Always begins with 4
		String variantShiftedHexBits = convertIntToHex(variantShiftedIntBits); // Always begins with one of 8, 9, a, b

		List<String> parts = new List<String> {
			randomStringAsHex.substring(0, 8),
			randomStringAsHex.substring(8, 12),
			versionShiftedHexBits + randomStringAsHex.substring(14, 16),
			variantShiftedHexBits + randomStringAsHex.substring(18, 20),
			randomStringAsHex.substring(20)
		};
		return String.join(parts, '-');
	}

	private static Integer convertHexToInt(String hex) {
		Integer d0 = hexMap.indexOf(hex.substring(1, 2));
		Integer d1 = hexMap.indexOf(hex.substring(0, 1));
		return d0 + (d1*16);
	}

	private static String convertIntToHex(Integer val) {
		// https://stackoverflow.com/a/13465128
		String hs0 = hexMap.get(val & 15); // i & 0x0f
		String hs1 = hexMap.get(((val >> 4) & 15)); // (i >> 4) & 0x0f
		return hs1 + hs0;
	}
}