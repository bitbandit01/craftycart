Meteor.methods({
   'createOrder' : function(sessId, paymentMethod, transactionId){
        if(!Meteor.user()){
            throw new Meteor.Error('denied', 'You must be logged-in to perform this action');
        }
        check(sessId, String);
        check(paymentMethod, String);
        check(transactionId, String);
        
        var order = {
            cart : [],
            paymentMethod : paymentMethod,
            transactionId : transactionId,
            paymentStatus : 'Paid',
            fulfillmentStatus : 'Processing',
            createdAt : new Date()
        };
        //Get the cart items so we can save the items ordered
        var carts = Carts.find({sessionId : sessId}).fetch();
        _.each(carts, function(cart){
           order.cart.push({
               'item' : cart.item._id,
               'sku' : cart.item.sku,
               'name' : cart.item.name,
               'size' : cart.item.size,
               'price' : cart.item.price,
               'qty' : cart.qty
           });
        });
       
        //Get all the saved metadata for the cart
        var cartMeta = CartsMeta.findOne({sessionId : sessId});
        _.each(cartMeta, function(value, key){
            order[key] = value;
        });

        //Return the generated order ID
        return Orders.insert(order, function(err, res){
            if(err){
                console.log(err);
            }else{
                //Process is complete, so delete the current cart
                Carts.remove({sessionId : sessId});
                CartsMeta.remove({sessionId: sessId});
                console.log(res);
                return res;
            }
        });
       
   }
});