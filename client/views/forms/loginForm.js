Template.loginForm.events({
    'submit #loginForm' : function(e, tmpl){
        e.preventDefault();
        // retrieve the input field values
        var email = tmpl.find('#login-email').value;
        var password = tmpl.find('#login-password').value;

        // Trim and validate your fields here....

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, function(err){
            if (err){
                $('#login-error').show();
            }
            else {
                $('#login-error').hide();
                //Hide the login form if called from the nav bar
                showLogin.set(false);
            }
        });
        return false;
    },
    'click #resetPassword' : function(e, tmpl){
        e.preventDefault();
        showLogin.set(false);
        FlowRouter.go('resetPassword');
    }
});