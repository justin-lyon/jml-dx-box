public with sharing class CaseTriggerFacade {
	public static final String TRIGGER_NAME = 'Case';

	public void beforeInsert (List<Case> newCases) {}

	public void afterInsert (List<Case> newCases) {}

	public void beforeUpdate (List<Case> newCases, Map<Id, Case> oldCases) {}

	public void afterUpdate (List<Case> newCases, Map<Id, Case> oldCases) {}
}
