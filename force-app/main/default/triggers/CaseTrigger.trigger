trigger CaseTrigger on Case (before insert) {

	// TriggerBypass.cls and __mdt allow for Manual control over trigger in Production
	// Cases are a high volume object and often require this functionality for high volume data loads
	if (TriggerBypass.isActive(CaseTriggerFacade.TRIGGER_NAME)) {
		CaseTriggerFacade facade = new CaseTriggerFacade();

		// Since Summer '18, we can use Switch Statements to make our Triggers more Readable
		// https://developer.salesforce.com/blogs/2018/05/summer18-rethink-trigger-logic-with-apex-switch.html
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