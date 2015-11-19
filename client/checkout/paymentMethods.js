Template.checkoutPayment.onCreated(function(){
    this.submitted = new ReactiveVar(false);
});

Template.checkoutPayment.onRendered(function(){
    //We can make use of Stripes in-built validators here
    jQuery.validator.addMethod("cardNumber", Stripe.validateCardNumber, "Please enter a valid card number");
    jQuery.validator.addMethod("cardCVC", Stripe.validateCVC, "Please enter a valid security code");
    jQuery.validator.addMethod("cardExpiry", function() {
        return Stripe.validateExpiry($("#cardMonth").val(),
            $("#cardYear").val())
    }, "Please enter a valid expiration date");

     $('#stripeForm').validate({
         rules : {
             cardNumber : {
                 required : true,
                 cardNumber : true
             },
             cardMonth : {
                 required : true
             },
             cardYear : {
                 required : true,
                 cardExpiry : true
             },
             cardCVC : {
                 required : true,
                 cardCVC : true
             }
         }
     });

    //Input names are required for validation, but need to be
    //removed as soon as the form is submitted so that no sensitive
    //data hits our server if there is an error etc.
    addInputNames();
});

Template.checkoutPayment.helpers({
    showTemplate : function(){
        return Session.get('showPaymentMethods');
    }
});

Template.checkoutPayment.events({
    'submit #stripeForm' : function(e, tmpl){
        //Important, remove input names for security reasons!
        removeInputNames();
        e.preventDefault();
        //Disable the submit button
        $('#stripeForm input[type=submit]').val('Processing payment...').attr("disabled", "disabled");
        //Send the data to stripe and get a token
        Stripe.card.createToken(
            e.target, //you can pass in the whole form as long as it has data-stripe attributes as according to docs
            function(status, response) {
                console.log(response);
                if(status != 200){
                    Notifications.error('Payment Error', 'Sorry, we could not process your payment.  Your card ' +
                                        'has not been charged.');
                    //re-enable the submit button
                    $('#stripeForm input[type=submit]').val('Submit Payment').removeAttr("disabled");
                }else{
                    Meteor.call('chargeStripe', Session.get('cartId'), response.id, function(err, res){
                        if(err){
                            Notifications.error('Payment Declined', 'Sorry, your payment was declined.' +
                                                ' Please try again.');
                            $('#stripeForm input[type=submit]').val('Submit Payment').removeAttr("disabled");
                        }else{
                            FlowRouter.go('thankyou');
                        }
                    });

                }
            }
        );
    }
});

var addInputNames = function() {
    $("#cardNumber").attr("name", "cardNumber");
    $("#cardMonth").attr("name", "cardMonth");
    $("#cardYear").attr("name", "cardYear");
    $("#cardCVC").attr("name", "cardCVC");
};

var removeInputNames = function() {
    $("#cardNumber").removeAttr("name");
    $("#cardMonth").removeAttr("name");
    $("#cardYear").removeAttr("name");
    $("#cardCVC").removeAttr("name");
};