Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 3000
    });
});

Template.layout.onCreated(function(){
   DocHead.setTitle('Crafty Cart');
});

Template.layout.onRendered(function(){
    $(document).foundation();
    $('.categories-carousel').slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        arrows: true
    });
    //this.offCanvas = new Foundation.OffCanvas($('#offCanvas'));
});

Template.layout.onDestroyed(function(){
    // let offCanvas = this.offCanvas;
    // if(offCanvas){
    //     offCanvas.destroy();
    // }
});

Template.layout.helpers({
    showLogin : function(){
        return showLogin.get();
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