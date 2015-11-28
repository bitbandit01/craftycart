Template.product.onCreated(function(){
   var self = this;
    self.autorun(function(){
       var product = FlowRouter.getParam("code");
       self.subscribe('aProduct', product); 
       self.subscribe('inventory');
    });
});

Template.product.helpers({
    product : function(){
        var code = FlowRouter.getParam("code");
        return Products.findOne({code: code});  
    },
    variants : function(code){
        return Inventory.find({product: code});
    }
});

Template.product.events({
    'click a' : function(e, tmpl){
        e.preventDefault();
        //Prevent accidental double-clicks
        $(e.target).attr('disabled', 'disabled');
        var sessId = Session.get('cartId');
        var description = this.size; 
        Meteor.call('addToCart', this._id, sessId, function(err, res){
            if(err){
                if(err.error == "no-stock"){
                    Notifications.error('Error', 'Sorry, we don\'t have enough stock to fulfill your request');
                }else{
                    Notifications.error('Error', 'Sorry, the product could not be added.');
                }
            }else{
                Notifications.success('Success', description + ' was added to your checkout.<br /><br /><a href="/cart">View Your Cart</a>');
            }
        });
        //Re-enable the button
        $(e.target).removeAttr('disabled');
    }
});