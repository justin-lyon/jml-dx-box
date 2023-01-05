({
  afterScriptsLoaded: function (cmp, event, helper) {
    cmp.set("v.isScriptsLoaded", true);
    helper.fetchSObjectType(cmp);
  },

  onRecordChange: function (cmp, event, helper) {
    var newRecordId = cmp.get("v.recordId");
    if (cmp.get("v.isScriptsLoaded")) helper.fetchSObjectType(cmp);
  },

  onCancel: function (cmp, event, helper) {}
});
