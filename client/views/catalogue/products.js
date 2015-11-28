Template.index.onCreated(function(){
  var self = this;
  self.autorun(function() {
      self.subscribe('products');
      self.subscribe('inventory');
  });
});

Template.index.helpers({
    products : function(){
        return Products.find();
    }
});