Meteor.startup(function(){
    if(Products.find().count() === 0){
        var products = [
            {
                name : 'Blue Widget',
                price : 299,
                available : 20
            },
            {
                name : 'Red Widget',
                price : 399,
                available : 10
            },
            {
                name : 'Green Widget',
                price : 450,
                available : 100
            }
        ];
        console.log('Creating dummy products');
        _.each(products, function(product){
            Products.insert(product);
        });
    }
    if(Coupons.find().count() === 0){
        console.log('Creating coupons');
        Coupons.insert({
            coupon : 'discount',
            value : 10,
            description : '10% OFF'
        });
        Coupons.insert({
            coupon : '20OFF',
            value : 20,
            description : '20% OFF'
        });
    }
    if(Meteor.users.find().count() === 0){
        console.log('Creating API user account');
        var user = Accounts.createUser({
           username : 'apiUser',
           password : 'goflyakiteintothemist',

        });
        if(user){
            var apikey = {
                'apikey' : Accounts._hashLoginToken('Y291GZl3RHfKzm9F3Sc5ERK3lG1Vyu87'),
            };
            Meteor.users.update({_id : user}, {$set : {'services.restivus' : apikey}}, function(err, res){
                console.log(err);
                console.log(res);
            });
        }
    }
});