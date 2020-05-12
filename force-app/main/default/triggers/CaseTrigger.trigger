trigger CaseTrigger on Case (before insert) {

	if (TriggerBypass.isActive(CaseTriggerFacade.TRIGGER_NAME)) {
		CaseTriggerFacade facade = new CaseTriggerFacade();

		switch on Trigger.OperationType {
			when BEFORE_INSERT {
				facade.beforeInsert(Trigger.New);
			}
			when BEFORE_UPDATE {
				facade.beforeUpdate(Trigger.New, Trigger.OldMap);
			}
			when AFTER_INSERT {
				facade.afterInsert(Trigger.New);
			}
			when AFTER_UPDATE {
				facade.afterUpdate(Trigger.New, Trigger.OldMap);
			}
		}
	}
}