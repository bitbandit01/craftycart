Template.checkoutShippingAddress.onCreated(function(){
    //Check if a shipping address is set for the order
    var meta = CartsMeta.findOne({sessionId : Session.get('cartId')});
    if(meta.shippingAddress){
        this.submitted = new ReactiveVar(true);
    }else{
        this.submitted = new ReactiveVar(false);
    }
});

Template.checkoutShippingAddress.helpers({
    showTemplate: function(){
        return Session.get('showShippingAddress');
    },
    submitted : function(){
        return !!Template.instance().submitted.get();
    },
    currentAddress : function(){
        var meta = CartsMeta.findOne({sessionId : Session.get('cartId')});
        return meta.shippingAddress;
    },
    shippingAddresses : function(){
        var data = Meteor.user().addresses;
        data = _.filter(data, function(obj){
            return obj.type == "Shipping";
        });
        return data ? data : false;
    }
});

Template.checkoutShippingAddress.events({
    'click a.edit-address' : function(e, tmpl){
        e.preventDefault();
        tmpl.submitted.set(false);
        Session.set('showShippingMethods', false);
        Session.set('showPaymentMethods', false);
    },
    'submit form[name=shippingAddressSelect]' : function(e, tmpl){
        e.preventDefault();
        var id = $('select').val();
        Meteor.call('updateOrderAddress', parseInt(id), 'Shipping', Session.get('cartId'), function(err, res){
            if(err){
                Notifications.error('Error', 'Error when submitting the form');
            }else{
                tmpl.submitted.set(true);
                Session.set('showShippingMethods', true);
            }
        });
    },
    'click #copyBillingAddress' : function(e, tmpl){
        e.preventDefault();
        //get current billing address
        var billing = CartsMeta.findOne({sessionId : Session.get('cartId')}).billingAddress;
        console.log(billing);
        if(billing){
            $('#shippingAddressForm input[name=company]').val(billing.company);
            $('#shippingAddressForm input[name=firstName]').val(billing.firstName);
            $('#shippingAddressForm input[name=surname]').val(billing.surname);
            $('#shippingAddressForm input[name=address1]').val(billing.address1);
            $('#shippingAddressForm input[name=address2]').val(billing.address2);
            $('#shippingAddressForm input[name=address3]').val(billing.address3);
            $('#shippingAddressForm input[name=town]').val(billing.town);
            $('#shippingAddressForm input[name=county]').val(billing.county);
            $('#shippingAddressForm input[name=postcode]').val(billing.postcode);
        }
    },
    'submit #shippingAddressForm' : function(e, tmpl){
        e.preventDefault();
        var address = _.object(_.map($(e.target).serializeArray(), _.values));
        console.log(address);
        address.country = 'United Kingdom';
        Meteor.call('addAddress', address, function(err, res){
            if(err){
                Notifications.error('Error', 'Sorry, we couldn\'t add the address');
            }else{
                console.log(res);
                Meteor.call('updateOrderAddress', parseInt(res), 'Shipping', Session.get('cartId'), function(err, res) {
                    if (err) {
                        Notifications.error('Error', 'Error when submitting the form');
                    } else {
                        tmpl.submitted.set(true);
                        Session.set('showShippingMethods', true);
                    }
                });
            }
        });
    }
});