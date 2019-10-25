({
  onRecordChange: function(cmp, event, helper) {
    var newRecordId = cmp.get("v.recordId");
    console.log('newRecordId', newRecordId);
  },

  onCancel: function(cmp, event, helper) {
    console.log('canceling');
  }
})
