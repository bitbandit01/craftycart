Meteor.publish('products', function(){
    //Return only published products
    return Products.find({publish : true});
});

Meteor.publish('aProduct', function(code){
    //Return a single product based on its code
    return Products.find({publish : true, code : code});
});

Meteor.publish('inventory', function(){
    //Return only variants which have been marked as available for sale
    return Inventory.find({available : true});
});

Meteor.publish('checkout', function(sessId){
   return Carts.find({'sessionId' : sessId}, {fields : {createdAt : 0}}); 
});

Meteor.publish('cartMeta', function(sessId){
   return CartsMeta.find({'sessionId' : sessId});
});

Meteor.publish('userAddresses', function(){
    return Meteor.users.find({_id : this.userId}, {fields : {'addresses' : 1}});
});

Meteor.publish('orders', function(){
   return Orders.find({userId : this.userId});
});