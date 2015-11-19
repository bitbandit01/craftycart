Template.checkoutBillingAddress.onCreated(function(){
    //Check if a billing address is set for the order
    var meta = CartsMeta.findOne({sessionId : Session.get('cartId')});
    if(meta.billingAddress){
        this.submitted = new ReactiveVar(true);
    }else{
        this.submitted = new ReactiveVar(false);
    }
});

Template.checkoutBillingAddress.helpers({
    submitted : function(){
        return !!Template.instance().submitted.get();
    },
    currentAddress : function(){
        var meta = CartsMeta.findOne({sessionId : Session.get('cartId')});
        return meta.billingAddress;
    },
    billingAddresses : function(){
        var data = Meteor.user().addresses;
        data = _.filter(data, function(obj){
            return obj.type == "Billing";
        });
        return data ? data : false;
    }
});

Template.checkoutBillingAddress.events({
    'click a.edit-address' : function(e, tmpl){
        e.preventDefault();
        tmpl.submitted.set(false);
    },
    'submit form[name=billingAddressSelect]' : function(e, tmpl){
        e.preventDefault();
        console.log(tmpl);
        var id = $('select').val();
        Meteor.call('updateOrderAddress', parseInt(id), 'Billing', Session.get('cartId'), function(err, res){
            if(err){
                Notifications.error('Error', 'Error when submitting the form');
            }else{
                tmpl.submitted.set(true);
                Session.set('showShippingAddress', true);
            }
        });
    },
    'submit #billingAddressForm' : function(e, tmpl){
        e.preventDefault();
        var address = _.object(_.map($(e.target).serializeArray(), _.values));
        console.log(address);
        address.country = 'United Kingdom';
        Meteor.call('addAddress', address, function(err, res){
            if(err){
                Notifications.error('Error', 'Sorry, we couldn\'t add the address');
            }else{
                console.log(res);
                Meteor.call('updateOrderAddress', parseInt(res), 'Billing', Session.get('cartId'), function(err, res) {
                    if (err) {
                        Notifications.error('Error', 'Error when submitting the form');
                    } else {
                        tmpl.submitted.set(true);
                        Session.set('showShippingAddress', true);
                    }
                });
            }
        });
    }
});
