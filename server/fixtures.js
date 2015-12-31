Meteor.startup(function(){
    if(Products.find().count() === 0){
        var products = [
            {
              "code" : "1002",
              "name": "Product Two - 2",
              "description": "Default product description. Added to with more words and descriptiveness.",
              "publish": true,
              "_id": "sJ2osKXzrohAWkHcm"
            },
            {
              "code" : "1001",
              "name": "Fragrance One - Updated",
              "description": "Default product description.\nEnter a full product description to be displayed on the website here.",
              "publish": true,
              "_id": "4xaXeXBnnE4ZrST6o"
            }
        ];
        console.log('Creating dummy products');
        _.each(products, function(product){
            Products.insert(product);
        });
    }
    if(Inventory.find().count() === 0){
        var inventory = [
    {
      "sku": "1001-102",
      "size": "1Kg",
      "product": "4xaXeXBnnE4ZrST6o",
      "inStock": 0,
      "price": 2500,
      "available": true,
      "_id": "GhNh7QqXbzHFxqCdm"
    },
    {
      "sku": "1001-103",
      "size": "5Kg",
      "product": "4xaXeXBnnE4ZrST6o",
      "inStock": 0,
      "price": 0,
      "available": false,
      "_id": "yBu5nD82LnMebCpLo"
    },
    {
      "sku": "1002-103",
      "size": "5Kg",
      "product": "sJ2osKXzrohAWkHcm",
      "inStock": 0,
      "price": 5020000,
      "available": false,
      "_id": "bum2GSpk7H2WL3xsL"
    },
    {
      "sku": "1001-104",
      "size": "25Kg",
      "product": "4xaXeXBnnE4ZrST6o",
      "inStock": 0,
      "price": 2000,
      "available": true,
      "_id": "JG23hyj5gyZfW5EvW"
    },
    {
      "sku": "1001-101",
      "size": "100g",
      "product": "4xaXeXBnnE4ZrST6o",
      "inStock": 0,
      "price": 0,
      "available": false,
      "_id": "eA9R7vR2WWGhM85pr"
    },
    {
      "sku": "1002-102",
      "size": "1Kg",
      "product": "sJ2osKXzrohAWkHcm",
      "inStock": 0,
      "price": 239,
      "available": true,
      "_id": "hMBhyvbChopGTPBL7"
    },
    {
      "sku": "1002-101",
      "size": "100g",
      "product": "sJ2osKXzrohAWkHcm",
      "inStock": 0,
      "price": 120,
      "available": true,
      "_id": "Juithf3rEXYcsmEjL"
    }
  ];
        console.log('Creating dummy inventory');
        _.each(inventory, function(item){
            Inventory.insert(item);
        });
    }
    // if(Coupons.find().count() === 0){
    //     console.log('Creating coupons');
    //     Coupons.insert({
    //         coupon : 'discount',
    //         value : 10,
    //         description : '10% OFF'
    //     });
    //     Coupons.insert({
    //         coupon : '20OFF',
    //         value : 20,
    //         description : '20% OFF'
    //     });
    // }
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