Template.registerForm.onRendered(function(){
    $("#registerForm").validate({
        rules: {
            email: {
                required: true,
                email : true
            },
            password: {
                required: true,
                minlength : 6
            },
            confirmPassword: {
                equalTo: "#account-password",
            }
        },
        messages : {
            email : "Please enter a valid email address",
            password : {
                required : "Please choose a secure password",
                minlength : "Please choose a secure password of at least 6 characters"
            },
            confirmPassword : "Please ensure that your passwords match"
        }
    });
});

Template.registerForm.events({
    'submit #registerForm' : function(e, tmpl){
        e.preventDefault();
        // retrieve the input field values
        var email = tmpl.find('#account-email').value;
        var password = tmpl.find('#account-password').value;

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Accounts.createUser({email : email, password : password}, function(err){
            if (err){
                $('#register-error').show();
            }
            else {
                $('#register-error').hide();
                //Hide the login form if called from the nav bar
                showLogin.set(false);
                Notifications.success('Success', 'Thanks for registering your account!');
            }
        });
        return false;
    }
});