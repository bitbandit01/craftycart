Meteor.methods({
   addAddress : function(obj){
       if(!Meteor.user()){
           throw new Meteor.Error('denied', 'You must be logged-in to perform this action');
       }
       check(obj, Schema.address);
       //Have to call clean to get the autovalues set on the obj  - because we are adding to
       // set of a collection which isnt currently under SimpleSchema control
       Schema.address.clean(obj);
       //Check if there is a default address of the selected type present in the collection
       var checkDefault = Meteor.users.find({_id : Meteor.userId(), 'addresses.type' : obj.type, 
                                             'addresses.isDefault' : true}).count();
       //If there is no default, then make this one the default
       if(!checkDefault || checkDefault < 1){
           obj.isDefault = true;
       }
       //Insert the new address record
       Meteor.users.update({_id : Meteor.userId()}, {$addToSet : {addresses : obj}}, function(err, res){
           if(err) {
               throw new Meteor.Error('error', 'Could not perform update');
           }else{
               //If this record wants to be default then make it so
               if(obj.isDefault){
                   setDefault(obj.id, obj.type);
               }
           }
       });
       //return the id of the new address
       return obj.id;
   },
   removeAddress : function(id){
       if(!Meteor.user()){
           throw new Meteor.Error('denied', 'You must be logged-in to perform this action');
       }
       //id is stored as a number
       check(id, Match.Integer);
       var exists = Meteor.users.find({_id : Meteor.userId(), 'addresses.id' : id}).count();
       if(exists && exists > 0){
            //Remove the address from the users account
           Meteor.users.update({_id : Meteor.userId()}, {$pull : { addresses : {id : id}}}, function(err, res){
               if(err) {
                   throw new Meteor.Error('error', 'Could not perform update');
               }else{
                   return true;
               }
           });
       }else{
           throw new Meteor.Error('error', 'That address does not belong to your account');
       }
   },
   setDefault : function(id, type){
       return setDefault(id, type);
   }
});

setDefault = function(id, type){
    if(!Meteor.user()){
        throw new Meteor.Error('denied', 'You must be logged-in to perform this action');
    }
    check(id, Match.Integer);
    check(type, String);
    //Remove the current default if there is one
    Meteor.users.update({_id : Meteor.userId(),
                         addresses : { $elemMatch : {type : type, isDefault : true}}
                       },
                       {$set : { 'addresses.$.isDefault' : false}});
    //Set the new default
    Meteor.users.update({_id : Meteor.userId(), 'addresses.id' : id}, {$set : {'addresses.$.isDefault' : true}});
    return true;
};