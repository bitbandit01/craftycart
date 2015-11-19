Template.checkoutShippingMethod.onCreated(function(){
    this.submitted = new ReactiveVar(false);
});

Template.checkoutShippingMethod.helpers({
    showTemplate : function(){
        return Session.get('showShippingMethods');
    }
});