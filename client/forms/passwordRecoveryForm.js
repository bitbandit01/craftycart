Template.passwordRecoveryForm.onRendered(function(){
    $("#passwordRecoveryForm").validate({
        rules: {
            email: {
                required: true,
                email : true
            }
        },
        messages : {
            email : "Please enter a valid email address",
        }
    });
});

Template.passwordRecoveryForm.events({
    'submit #passwordRecoveryForm' : function(e, tmpl){
        e.preventDefault();
        // retrieve the input field values
        var email = tmpl.find('#recovery-email').value;

        Accounts.forgotPassword({email: email}, function(err){
            if (err){
                $('#recovery-error').show();
            }
            else {
                $('#recovery-error').hide();
                $('#recovery-success').show();
            }
        });
        return false;
    }
});