FlowRouter.route('/', {
    name: 'home',
    action: function(params, queryparams){
        BlazeLayout.render('layout', {content: 'index'});
    }
});

FlowRouter.route('/cart', {
    name: 'cart',
    action: function(params, queryparams){
        BlazeLayout.render('layout', {content: 'cart'});
    }
});

FlowRouter.route('/checkout', {
    name: 'checkout',
    action: function(params, queryparams){
        BlazeLayout.render('layout', {content: 'checkout'});
    }
});

FlowRouter.route('/thankyou', {
    name: 'thankyou',
    action: function(params, queryparams){
        BlazeLayout.render('layout', {content: 'thankyou'});
    }
});

FlowRouter.route('/account', {
    name: 'userProfile',
    action : function(params, queryparams){
        BlazeLayout.render('layout', {content: 'userProfile'});
    }
});

FlowRouter.route('/login', {
    name: 'login',
    action : function(params, queryparams){
        BlazeLayout.render('layout', {content: 'login'});
    }
});

FlowRouter.route('/resetPassword', {
    name: 'resetPassword',
    action : function(params, queryparams){
        BlazeLayout.render('layout', {content: 'resetPassword'});
    }
});

FlowRouter.route('/resetPassword/:token', {
    name: 'resetPassword',
    action : function(params, queryparams){
        BlazeLayout.render('layout', {content: 'resetPassword'});
    }
});