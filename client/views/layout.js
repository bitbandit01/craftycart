Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 3000
    });
});

Template.layout.onCreated(function(){
   DocHead.setTitle('Crafty Cart');
   showLogin = new ReactiveVar(false);
});

Template.layout.helpers({
    showLogin : function(){
        return showLogin.get();
    }
});

Template.layout.events({
    'click #login' : function(e){
        e.preventDefault();
        showLogin.set(true);
    },
    'click #cancelLogin' : function(e){
        e.preventDefault();
        showLogin.set(false);
    }
});

Template.userHeader.helpers({
    userEmail : function(){
        return Meteor.user().emails[0].address;
    }
})

Template.userHeader.events({
    'click #logout' : function(e){
        e.preventDefault();
        Meteor.logout();
        return;
    }
});