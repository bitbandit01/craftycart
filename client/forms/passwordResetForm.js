Template.passwordResetForm.onRendered(function(){
    $("#passwordResetForm").validate({
        rules: {
            password: {
                required: true,
                minlength : 6
            },
            confirmPassword: {
                equalTo: "#reset-password",
            }
        },
        messages : {
            password : {
                required : "Please choose a secure password",
                minlength : "Please choose a secure password of at least 6 characters"
            },
            confirmPassword : "Please ensure that your passwords match"
        }
    });
});

Template.passwordResetForm.events({
    'submit #passwordResetForm' : function(e, tmpl){
        e.preventDefault();
        // retrieve the input field values
        var password = tmpl.find('#reset-password').value;
        var token = FlowRouter.current().params.token;
        Accounts.resetPassword(token, password, function(err){
            if (err){
                console.log(err);
                $('#reset-error').html('Sorry we couldn\'t reset your password. ' + err.reason +
                    '. Please try the reset process again.').show();
            }
            else {
                $('#reset-error').hide();
                $('#reset-success').show();
                FlowRouter.go('/');
            }
        });
        return false;
    }
});