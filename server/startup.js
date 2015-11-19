Meteor.startup(function () {
    Accounts.config({
        sendVerificationEmail: false,
        forbidClientAccountCreation: false
    });
    //change the default password reset url to work with our current FlowRouter setup
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('resetPassword/' + token);
    };
    
});