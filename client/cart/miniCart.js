Template.miniCart.onCreated(function(){
  if(!Session.get('cartId') || Session.equals('cartId', undefined)) {
      var newSession = Random.id();
      Session.set('cartId', newSession);
  }
  var sessId = Session.get('cartId');
  console.log('Session: ' + Session.get('cartId'));
  var self = this;
  self.autorun(function() {
      self.subscribe('checkout', sessId);
  });
});

Template.miniCart.helpers({
   countCart : function(){
       return Carts.find().count();
   } 
});