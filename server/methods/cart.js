//SERVER ONLY METHODS

Meteor.methods({
    validateCoupon : function(coupon, sessId){
        check(coupon, String);
        check(sessId, String);
        console.log('Validating coupon: '+ coupon + sessId);
        var valid = Coupons.findOne({coupon : coupon});
        if(valid){
            CartsMeta.upsert({sessionId : sessId}, {$set : {coupon : coupon}}, function(err, res){
                console.log(err, res);
            });
            Meteor.call('calcCartTotals', sessId);
            return true;
        }else{
            throw new Meteor.Error('invalid-coupon', 'Coupon could not be validated');
        }
    },

    removeCoupon : function(sessId){
        check(sessId, String);
        CartsMeta.update({sessionId : sessId}, {$set : {coupon : ""}});
        Meteor.call('calcCartTotals', sessId);
        return true;
    },
    calcCartTotals : function(cartId){
        console.log('calculating cart totals: ' + cartId);
        var data = {};
        //Fetch the current metaCart
        var metaCart = CartsMeta.findOne({sessionId : cartId});

        //TODO : Create new metaCart can be done in Schema design
        if( !metaCart ){
            data = {
                'subtotal' : 0,
                'shipping' : 0,
                'coupon' : "",
                'discountAmount' : 0,
                'discountValue' : 0,
                'vat' : 0,
                'total' : 0
            };
        }else{
            data = metaCart;
            data.subtotal = data.shipping = data.discountAmount = data.discountValue =  data.vat = data.total = 0;
        }

        //Fetch all the checkout items
        var carts = Carts.find({sessionId : cartId}).fetch();

        //Calculate Subtotal
        var subtotal = 0;
        _.each(carts, function(cart){
            subtotal += (cart.qty * cart.item.price);
        });
        data.subtotal = subtotal;

        //Calculate Shipping Costs
        data.shipping = calculateShipping(data);

        //Calculate Discounts
        if(data.coupon.length > 0){
            var discount = calculateDiscount(data);
            data.discountAmount = discount.discountAmount;
            data.discountValue = discount.discountValue;
        }

        //Calaculate total cost
        var total = data.subtotal + data.shipping - data.discountValue;
        data.total = total;

        //Calculate VAT included in the total
        var vat = data.total - (data.total/1.2);
        data.vat = parseInt(accounting.toFixed(vat, 0));

       
        data.sessionId = cartId;
        if(Meteor.user()){
            data.userId = Meteor.userId();
        }
        
        //Update the totals in the database
        //THIS BREAKS IF YOU APPLY A SCHEMA - SAD FACE :(
        //COLLECTION2 REQUIRES AN OPERATOR LIKE $SET FOR SOME REASON
        CartsMeta.upsert({sessionId: cartId}, data, function(err, res){
            return;
        });

    },
    updateOrderAddress : function(id, type, cartId){
        if(!Meteor.user()) {
            throw new Meteor.Error('denied', 'You must be logged-in to perform this action');
        }
        check(id, Number);
        check(type, String);
        check(cartId, String);
        //var address = Meteor.users.find({_id : Meteor.userId(), 'addresses.id' : id}, {addresses: 1}).fetch();
        var address = _.find(Meteor.user().addresses, function(obj) {
            return obj.id == id;
        });
        if(type == 'Billing'){
            CartsMeta.update({sessionId : cartId}, {$set : {billingAddress : address}});
        }
        if(type == 'Shipping'){
            CartsMeta.update({sessionId : cartId}, {$set : {shippingAddress : address}});
        }
        return;
    }

});

calculateDiscount = function(obj){
        var res = {};
        var coupon = Coupons.findOne({coupon : obj.coupon});
        res.discountAmount = coupon.description;
        var discountValue = (coupon.value/100) * obj.subtotal;
        res.discountValue = parseInt(accounting.toFixed(discountValue, 0));
        return res;
};

calculateShipping = function(obj){
        if(obj.subtotal > 3000 || obj.subtotal < 1){
            var shipping = 0;
        }else{
            var shipping = 350;
        }
        return shipping;
};