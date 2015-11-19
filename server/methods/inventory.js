Meteor.methods({    
    removeInventory : function(itemId, qty){
        check(itemId, String);
        check(qty, Match.Integer);
        if(qty < 1){
            Meteor.throw(new Match.Error);
        }
        Products.update({_id : itemId}, {$inc : {available : (qty*-1)}});
        return true;
    }
});


//HELPER FUNCTIONS

checkInventory = function(itemId, qty){
    check(itemId, String);
    check(qty, Match.Integer);
    var item = Products.findOne(itemId);
    if(qty > item.available){
        throw new Meteor.Error("no-stock", "Not enough stock available to fulfill your request");
    }else{
        return;
    }
};