Template.checkout.onCreated(function(){
    var self = this;
    self.autorun(function() {
        var sessId = Session.get('cartId');
        self.subscribe('cartMeta', sessId);
        self.subscribe('userAddresses');
    });
    //Set up widget-flow variables
    if(!Session.get('showShippingAddress')){
        Session.set('showShippingAddress', false);
    }
    if(!Session.get('showShippingMethods')){
        Session.set('showShippingMethods', false);
    }
    if(!Session.get('showPaymentMethods')){
        Session.set('showPaymentMethods', false);
    }
});







