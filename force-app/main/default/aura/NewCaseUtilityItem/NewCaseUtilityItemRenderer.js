({
  afterRender: function(cmp, helper) {
    this.superAfterRender();
    helper.afterRender(cmp, helper);
  }
})