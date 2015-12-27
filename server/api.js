//Expose collection via Restivus API
if(Meteor.isServer){
    // Global API configuration
    Api = new Restivus({
        version : "v1",
        useDefaultAuth: false, //default auth wasnt working. I only need one user so I use custom function below.
        auth : {
            token : 'services.restivus.apikey',
            //From the docs:
            //This is your chance to completely override the user authentication process. If a user is returned,
            // any userId and token will be ignored, as it's assumed that you have already successfully authenticated
            // the user (by whatever means you deem necessary). The given user is simply attached to the
            // endpoint context, no questions asked.
            user : function() {
                //Check that the auth token is present in the request
                if(this.request.headers['x-auth-token']){
                    check(this.request.headers['x-auth-token'], String);
                    var token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);
                }else{
                    //Cant authenticate without a token
                    return false;
                }
                //Check that the auth token matches the stored one for our api user
                var user = Meteor.users.findOne({username : 'apiUser', 'services.restivus.apikey' : token});
                if(user){
                    //If a match was found, return the authenticated user
                    return {user : user};
                }
            },
        },
        prettyJson: true
    });

    Api.addCollection(Coupons, {
        //Allow only post and get on entire collection
        excludedEndpoints : ['get', 'put'],
        routeOptions : {
            authRequired: true
        }
    });
    
    Api.addRoute('products', {authRequired : true}, {
        get : function(){
            var products = Products.find().fetch();
            return {
                statusCode: 200,
                body: products
            };
        },
        post : function(){
            err = [];
            res = [];
            try{
                check(this.request.body, Array);
            }catch(e){
                return {
                    statusCode: 500,
                    body: "Expected an Array of Products"
                };
            }
            _.each(this.request.body, function(product){
                var found = Products.findOne({code : product.code});
                if(found){
                    err.push('Error : ' + product.code + ' exists');
                }else{
                    Products.insert(product);
                    res.push('Success : ' + product.code + ' was added');
                }
            });
            return {
                statusCode: 200,
                body: {
                    errors : err,
                    result : res
                }
            };
        }
    });

    Api.addRoute('products/:code', {authRequired : true}, {
        get : function(){
            var code = this.urlParams.code;
            var product = Products.findOne({code : code});
            if(!product) {
                return {
                    statusCode: 404,
                    body: 'Product does not exist'
                }
            }else{
                return {
                    statusCode: 200,
                    body: product
                };
            }
        },
        put : function(){
            var code = this.urlParams.code;
            var product = Products.findOne({code : code});
            if(!product) {
                return {
                    statusCode: 404,
                    body: 'Product does not exist'
                }
            }else{
                Products.update({_id : product._id}, {$set : this.request.body});
                var product = Products.findOne({code : code});
                return {
                    statusCode: 200,
                    body: product
                };
            }
        }
    });

    Api.addRoute('inventory', {authRequired : true}, {
        get : function(){
            var inventory = Inventory.find().fetch();
            return {
                statusCode: 200,
                body: inventory
            };
        },
        post : function(){
            err = [];
            res = [];
            _.each(this.request.body, function(item){
                var found = Inventory.findOne({sku : item.sku});
                console.log(found);
                if(found){
                    err.push('Error : ' + item.sku + ' exists');
                }else{
                    Inventory.insert(item);
                    res.push('Success : ' + item.sku + ' was added');
                }
            });
            return {
                statusCode: 200,
                body: {
                    errors : err,
                    result : res
                }
            };
        }
    });

    Api.addRoute('inventory/:sku', {authRequired : true}, {
        get : function(){
            var sku = this.urlParams.sku;
            var item = Inventory.findOne({sku : sku});
            if(!item) {
                return {
                    statusCode: 404,
                    body: 'Variant does not exist'
                }
            }else{
                return {
                    statusCode: 200,
                    body: item
                };
            }
        },
        put : function(){
            var sku = this.urlParams.sku;
            var item = Inventory.findOne({sku : sku});
            if(!item) {
                return {
                    statusCode: 404,
                    body: 'Variant does not exist'
                }
            }else{
                Inventory.update({_id : item._id}, {$set : this.request.body});
                var item = Inventory.findOne({sku : sku});
                return {
                    statusCode: 200,
                    body: item
                };
            }
        }
    });

    Api.addRoute('orders', {authRequired : true}, {
        get : function(){
            //Start Time for Query
            if(this.queryParams.time_from){
               var time_from = this.queryParams.time_from;
            }else{
               var time_from = new Date().getTime() - (24*60*60*1000);
            }
            //End Time for Query
            if(this.queryParams.time_to){
               var time_to = this.queryParams.time_to;
            }else{
               //now
               var time_to = new Date().getTime();
            }
            //Order Status
            if(this.queryParams.status){
               var status = this.queryParams.status;
            }else{
               //all statuses
               var status = ['Pending', 'Paid'];
            }
            var orders = Orders.find({
                                createdAt : {$gte : new Date(time_from), $lte : new Date(time_to)}
                                     }).fetch();
            return {
                statusCode: 200,
                body: orders
            };
        }
    });
    
    Api.addRoute('orders/:orderNum', {authRequired : true}, {
        get : function(){
            var orderNum = this.urlParams.orderNum;
            var order = Orders.findOne({orderNum : orderNum});
            if(!order) {
                return {
                    statusCode: 404,
                    body: 'Order does not exist'
                }
            }else{
                return {
                    statusCode: 200,
                    body: order
                };
            }
        },
        post : function() {
            try { 
                var orderNum = this.urlParams.orderNum;
                check(orderNum, String);
                var order = Orders.findOne({orderNum : orderNum});
                if(!order){
                    return {
                        statusCode : 404,
                        body : "Order does not exist"
                    };
                }
                //Data is an object
                var data = this.request.body;
                check(data, Object);
                //Data should contain some keys to update
                if(Object.keys(data).length < 1){
                    return {
                        status : 500,
                        body : "Empty request"
                    }
                }
                //This allows partial updating of only the keys in the request,
                //rather than having to do a put of the entire Order document
                var disallowed = ['orderNum']; //keys that cant be updated
                _.each(data, function(val, key){
                    var obj = {};
                    obj[key] = val;
                    if(disallowed.indexOf(key) == -1){
                        Orders.update({orderNum : orderNum}, {$set : obj});
                    }                  
                });
                return {
                    statusCode : 200,
                    body : "Record updated successfully"
                };
            } catch(e){
                //Log the error
                console.log(e);
                return {
                    statusCode : 500,
                    body : {
                        error : "Malformed request"
                    }
                };
            }
        }
    });
}