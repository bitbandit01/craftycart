Template.cart.onCreated(function(){
    var self = this;
    self.autorun(function(){
        var sessId = Session.get('cartId');
        self.subscribe('checkout', sessId);
        self.subscribe('cartMeta', sessId);
        self.subscribe('products');
    });
});

Template.cart.helpers({
    cartItems : function(){
        return Carts.find();
    }
});

Template.cartRow.events({
    'change input' : function(e){
        e.preventDefault();
        var qty = parseInt(e.target.value);
        Meteor.call('updateCartQty', this._id, qty, function(err, res){
            if(err){
                if(err.error == 'no-stock'){
                    Notifications.error('Error', 'Sorry, we don\'t have enough stock to fulfill your request');
                }else{
                    Notifications.error('Error', 'Sorry, couldn\'t update the checkout. Please try again.');
                }
            }
        });
    },
    'click a' : function(e){
        e.preventDefault();
        Meteor.call('updateCartQty', this._id, 0, function(err, res){
            if(err){
                Notifications.error('Error', 'Sorry, couldn\'t update the checkout. Please try again.');
            }
        });
    }
});

Template.cartTotals.helpers({
    totals : function(){
        return CartsMeta.findOne({sessionId : Session.get('cartId')});
    },
    showDiscount : function(){
        return !! CartsMeta.findOne({sessionId : Session.get('cartId')}).coupon.length;
    }
});

Template.cartDiscount.helpers({
    coupon : function(){
        return CartsMeta.findOne({sessionId : Session.get('cartId')}).coupon;
    }
});

Template.cartDiscount.events({
    'click a.apply-discount' : function(e){
        e.preventDefault();
        var coupon = $('input[name=coupon]').val();
        var sessId = Session.get('cartId');
        Meteor.call('validateCoupon', coupon, sessId, function(err, res){
            if(err){
                Notifications.error('Invalid', 'Sorry, the code you entered was not valid');
            }
        });
    },
    'click a.remove-discount' : function(e){
        e.preventDefault();
        var sessId = Session.get('cartId');
        Meteor.call('removeCoupon', sessId, function(err, res){
            if(err){
                Notifications.error('Error', 'Sorry, there was a problem completing your request.');
            }
        });
    }
});