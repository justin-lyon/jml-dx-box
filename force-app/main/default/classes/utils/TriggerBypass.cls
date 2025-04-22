public with sharing class TriggerBypass {
  private static final String REPLACER = '{!name}';
  private static final String ERROR_MESSAGE =
    'No record by MasterLabel: ' +
    REPLACER +
    ' found in TriggerBypass__mdt Custom Metadata.';

  private static TriggerBypassRepo bypassRepo = new TriggerBypassRepo();
  public static TriggerBypassRepo bypassDI {
    get;
    set {
      bypassRepo = value;
    }
  }

  public static Boolean isActive(String triggerName) {
    TriggerBypass__mdt record;

    try {
      record = bypassRepo.getInstance(triggerName);
    } catch (QueryException qex) {
      String message = ERROR_MESSAGE.replace(REPLACER, triggerName);
      throw new TriggerBypassException(message);
    }

    return record.IsActive__c;
  }

  public class TriggerBypassException extends Exception {
  }
}
