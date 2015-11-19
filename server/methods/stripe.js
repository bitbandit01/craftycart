Meteor.methods({
    //Authorise a charge against the customers card, 
    //create an order record,
    //then finally capture the payment from Stripe
    chargeStripe : function(sessId, token){
        if(!Meteor.user()){
            throw new Meteor.Error('denied', 'You must be logged-in to perform this action');
        }
        check(sessId, String);
        check(token, String);
        var cart = CartsMeta.findOne({sessionId : sessId});
        //Make sure the cart exists
        if(!cart){
            throw new Meteor.Error('error', 'Could not complete payment');
        }

        //Need to do some Synch stuff here to avoid callback-hell
        var callSync = Meteor.wrapAsync(Meteor.call);

        //Re-calculate the cart totals now to ensure it hasn't been messed with
        callSync('calcCartTotals', sessId, function(err, res) {
            if (err) {
                throw new Meteor.Error('error', 'Could not complete payment');
            }
        });

        cart = CartsMeta.findOne({sessionId : sessId});
        //Stripe wants the total in pennies
        var total = parseInt(cart.total);
        //Do the actual charge via the helper function below to get a useful value back
        try{
            var payment = createStripeCharge(total, token);
        }catch(e){
            throw new Meteor.Error('error', 'Payment was declined');
        }

        //Successful payment, can now turn the metacart into an actual order record
        Meteor.call('createOrder', sessId, 'Stripe', payment.id, function(err, res){
            if(err){
                throw new Meteor.Error('error', 'Could not complete payment');
            }else{
                var orderNum = Orders.findOne(res).orderNum;
                //add the order number to the charge
                updateStripeCharge(payment.id, orderNum);
                //capture the payment
                captureStripeCharge(payment.id);
            }
        });
    }
});

//I dont really know why I have to put this here and not up in the method.
//But coupled with try/catch its the only way to actually return an error from Stripe that is useful.
//I think they lied. Javascript is not sexy.
var createStripeCharge = function(total, token){
    //Get the Stripe secret key and load the API
    var secret = Meteor.settings.private.stripe.testSecretKey;
    var Stripe = StripeAPI(secret);
    var StripeSync = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);
    return StripeSync({
        amount: total,
        currency: 'gbp',
        source: token,
        capture : false
    });
};

//Adds a description to the Stripe Charge, currently the generated Order Number
var updateStripeCharge = function(charge, description){
    //Get the Stripe secret key and load the API
    var secret = Meteor.settings.private.stripe.testSecretKey;
    var Stripe = StripeAPI(secret);
    var StripeSync = Meteor.wrapAsync(Stripe.charges.update, Stripe.charges);
    return StripeSync(charge, {
        description: description
    });
}

//Function for capturing a previously authorised charge, will be called once the order 
//is successfully saved on our system
var captureStripeCharge = function(charge){
    //Get the Stripe secret key and load the API
    var secret = Meteor.settings.private.stripe.testSecretKey;
    var Stripe = StripeAPI(secret);
    var StripeSync = Meteor.wrapAsync(Stripe.charges.capture, Stripe.charges);
    return StripeSync(charge);
}