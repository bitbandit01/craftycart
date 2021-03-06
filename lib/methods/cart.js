Meteor.methods({
    addToCart : function(itemId, sessId){
        //Basic sanity checks
        check(itemId, String);
        check(sessId, String);
        //Grab a copy of the item data as it exists when added to the checkout
        //Ensures continuity of price, product name etc in case these change
        var variant = Inventory.findOne(itemId);
        var product = Products.findOne({code : variant.product});
        //Check the variant is ok to be added to a cart
        if(variant.price < 1){
            throw new Meteor.Error('Price Error', 'Sorry, there appears to be a problem with this item.');
        }
        if(variant.inStock < 1){
            throw new Meteor.Error('Stock Error', 'Sorry, we appear to have just run out of stock!');
        }
        var itemRecord = {
            _id : variant._id,
            product : product._id,
            name : product.name,
            sku : variant.sku,
            size : variant.size,
            price : variant.price
        };
        var record = {
            sessionId : sessId,
            item: itemRecord,
            createdAt : Date()
        };
        //Insert a new Cart record, or update it if it already exists
        var existingRecord = Carts.findOne({sessionId : sessId, "item._id" : itemId});
        if(existingRecord){
            Meteor.call('updateCartQty', existingRecord._id, (existingRecord.qty + 1));
        }else{
            //Carts.upsert({sessionId : sessId, "item._id" : itemId}, {$set : record, $inc : {qty : 1}});
            record.qty = 1;
            Carts.insert(record);
            Meteor.call('calcCartTotals', sessId);
            return true;
        }
    },
    updateCartQty : function(lineId, qty) {
        //Basic sanity checks
        check(lineId, String);
        check(qty, Match.Integer);
        if (qty < 0) {
            Meteor.throw(new Match.Error);
        }
        //Retrieve the checkout (need the sessionId to update)
        var cart = Carts.findOne(lineId);
        //If the qty is set to zero, remove the checkout record completely
        if (qty === 0) {
            Carts.remove(lineId);
            Meteor.call('calcCartTotals', cart.sessionId);
            return;
        }
        //Inventory check on the server
        if(Meteor.isServer){
            checkInventory(cart.item._id, qty);
        }
        Carts.update({_id: lineId}, {$set: {qty: qty}});
        Meteor.call('calcCartTotals', cart.sessionId);
        return true;
    }
});