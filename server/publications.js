Meteor.publish('products', function(){
    return Products.find();
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