public with sharing class CaseTriggerFacade {
	public static final String TRIGGER_NAME = 'Case';

	public void beforeInsert (List<Case> newCases) {
		List<Case> toProcess = new List<Case>();

		for (Case newCase : newCases) {
			// Filter and bucket newCases
			if (newCase.Type == 'BusinessRule') {
				toProcess.add(newCase);
			}
		}

		if (!toProcess.isEmpty()) {
			// Pass each filtered list to Business Layer for processing
		}
	}

	public void afterInsert (List<Case> newCases) {}

	public void beforeUpdate (List<Case> newCases, Map<Id, Case> oldCases) {}

	public void afterUpdate (List<Case> newCases, Map<Id, Case> oldCases) {}
}
