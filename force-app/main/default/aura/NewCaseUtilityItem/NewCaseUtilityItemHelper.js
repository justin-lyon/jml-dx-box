({
  init: function(cmp, helper) {
    var utilityBar = cmp.find('utilityBar');
    helper.getUtilityInfo(cmp, utilityBar);
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
