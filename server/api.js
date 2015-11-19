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

    Api.addCollection(Orders, {
        //Allow only post and get on entire collection, get on the individual order
        excludedEndpoints : ['put', 'delete'],
        routeOptions : {
            authRequired: true
        }
    });
}