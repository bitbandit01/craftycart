Meteor.methods({    
    removeInventory : function(itemId, qty){
        check(itemId, String);
        check(qty, Match.Integer);
        if(qty < 1){
            Meteor.throw(new Match.Error);
        }
        Inventory.update({_id : itemId}, {$inc : {inStock : (qty*-1)}});
        return true;
    }
});


//HELPER FUNCTIONS

checkInventory = function(itemId, qty){
    check(itemId, String);
    check(qty, Match.Integer);
    var item = Inventory.findOne(itemId);
    if(qty > item.inStock){
        throw new Meteor.Error("no-stock", "Not enough stock available to fulfill your request");
    }else{
        return;
    }
};