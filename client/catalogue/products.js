Template.index.onCreated(function(){
  var self = this;
  self.autorun(function() {
      self.subscribe('products');
  });
});

Template.index.helpers({
    products : function(){
        return Products.find();
    }
});

Template.product.events({
    'click a' : function(e){
        e.preventDefault();
        //Prevent accidental double-clicks
        $(e.target).attr('disabled', 'disabled');
        var sessId = Session.get('cartId');
        var name = this.name;
        Meteor.call('addToCart', this._id, sessId, function(err, res){
            if(err){
                if(err.error == "no-stock"){
                    Notifications.error('Error', 'Sorry, we don\'t have enough stock to fulfill your request');
                }else{
                    Notifications.error('Error', 'Sorry, the product could not be added.');
                }
            }else{
                Notifications.success('Success', name + ' was added to your checkout.<br /><br /><a href="/cart">View Your Cart</a>');
            }
        });
        //Re-enable the button
        $(e.target).removeAttr('disabled');
    }
});