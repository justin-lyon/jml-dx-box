trigger CaseTrigger on Case (before insert) {

	if (TriggerBypass.isActive(CaseTriggerFacade.TRIGGER_NAME)) {
		// TODO Trigger logic
	}
}