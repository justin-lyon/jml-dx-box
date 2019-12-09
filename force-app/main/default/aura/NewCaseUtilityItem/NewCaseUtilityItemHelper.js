({
  init: function(cmp, helper) {
    var utilityBar = cmp.find('utilityBar');
    helper.getUtilityInfo(cmp, utilityBar);
  },

  fetchSObjectType: function(cmp) {
    var action = cmp.get('c.getSObjectType');
    action.setParams({
      recordId: cmp.get("v.recordId")
    });

    kit.promisify(action)
      .then(res => {
        var name = res.getReturnValue();
        console.log('object name', name);
        cmp.set('v.sObjectName', name);
      })
      .catch(err => {
        console.error('Error getting sobject name', err.message);
      })
  },

  getUtilityInfo: function(cmp, utilityBar) {
    utilityBar.getUtilityInfo()
      .then(utilityItem => {
        console.log('getEnclosingUtilityId', JSON.parse(JSON.stringify(utilityItem)));
        cmp.set('v.utilityItemInfo', utilityItem);
      })
      .catch(err => {
        console.error('error getUtilityInfo', err);
      })
  },

  afterRender: function(cmp, helper) {
    helper.init(cmp, helper);
  }
})
