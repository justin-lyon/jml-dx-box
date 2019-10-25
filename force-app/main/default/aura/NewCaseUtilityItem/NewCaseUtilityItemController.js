({
  onRecordChange: function(cmp, event, helper) {
    var utilityBar = cmp.find('utilityBar');
    var newRecordId = cmp.get("v.recordId");
    console.log('newRecordId', newRecordId);

    // utilityBar.getUtilityInfo()
    //   .then(res => {
    //     console.log('utility Info', res);
    //   })
    //   .catch(err => {
    //     console.error('error getting util info', err);
    //   })


  },

  onCancel: function(cmp, event, helper) {
    console.log('canceling');
  }
})
