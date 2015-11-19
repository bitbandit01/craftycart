Template.userProfile.onCreated(function(){
    var self = this;
    self.autorun(function (){
        self.subscribe('userAddresses');
        self.subscribe('orders');
    });
    addBillingAddress = new ReactiveVar(false);
    addShippingAddress = new ReactiveVar(false);
});

Template.userProfile.onDestroyed(function(){
    addBillingAddress.set(false);
    addShippingAddress.set(false);
});

Template.userProfile.helpers({
    email : function(){
        var user = Meteor.user();
        return user.emails[0].address;
    },
    billingAddresses : function(){
        var data = Meteor.user().addresses;
        data = _.filter(data, function(obj){
           return obj.type == "Billing";
        });
        return data ? data : false;
    },
    addBillingAddress : function(){
        return addBillingAddress.get();
    },
    addShippingAddress : function(){
        return addShippingAddress.get();
    },
    shippingAddresses : function(){
        var data = Meteor.user().addresses;
        data = _.filter(data, function(obj){
           return obj.type == "Shipping";
        });
        return data ? data : false;
    },
    orders : function(){
        var orders = Orders.find().fetch();
        return orders ? orders : false;
    }
});

Template.userProfile.events({
    'click #resetPassword' : function(e){
        e.preventDefault();
        if(Meteor.userId()){
            var options = {
                email : Meteor.user().emails[0].address
            };
            Accounts.forgotPassword(options, function(err){
                if(!err){
                    Notifications.success('A password reset link has been sent to your e-mail address.' +
                        '  Please check in a few minutes.');
                }
            });
        }
    },
    'click #addBillingAddress' : function(e){
        e.preventDefault();
        addBillingAddress.set(true);
    },
    'submit #billingAddressForm' : function(e, tmpl){
        e.preventDefault();
        var address = _.object(_.map($(e.target).serializeArray(), _.values));
        Meteor.call('addAddress', address, function(err, res){
            if(err){
                Notifications.error('Error', 'Sorry, we couldn\'t add the address');
            }else{
                Notifications.success('Success', 'The new address was added to your profile');
                addBillingAddress.set(false);
            }
        });
    },
    'click #cancelAddBillingAddress' : function(e){
        e.preventDefault();
        $('#billingAddressForm')[0].reset();
        addBillingAddress.set(false);
    },
    'click #addShippingAddress' : function(e){
        e.preventDefault();
        addShippingAddress.set(true);
    },
    'submit #shippingAddressForm' : function(e, tmpl){
        e.preventDefault();
        var address = _.object(_.map($(e.target).serializeArray(), _.values));
        Meteor.call('addAddress', address, function(err, res){
            if(err){
                Notifications.error('Error', 'Sorry, we couldn\'t add the address');
            }else{
                Notifications.success('Success', 'The new address was added to your profile');
                addShippingAddress.set(false);
            }
        });
    },
    'click #cancelAddShippingAddress' : function(e){
        e.preventDefault();
        $('#shippingAddressForm')[0].reset();
        addShippingAddress.set(false);
    },
    'click a.delete' : function(e){
        e.preventDefault();
        Meteor.call('removeAddress', this.id, function(err, res){
           if(err){
               Notifications.error('error', 'Sorry, could not remove the address');
           }
        });
    },
    'click a.set-default' : function(e){
        e.preventDefault();
        Meteor.call('setDefault', this.id, this.type, function(err, res){
           if(err){
               Notifications.error('error', 'Sorry, could not set as default');
           }
        });
    }
});


// Template.address.events({
//     'click a.delete' : function(e){
//         e.preventDefault();
//         Meteor.call('removeAddress', this.id, function(err, res){
//            if(err){
//                Notifications.error('error', 'Sorry, could not remove the address');
//            }
//         });
//     },
//     'click a.set-default' : function(e){
//         e.preventDefault();
//         Meteor.call('setDefault', this.id, this.type, function(err, res){
//            if(err){
//                Notifications.error('error', 'Sorry, could not set as default');
//            }
//         });
//     }
// });