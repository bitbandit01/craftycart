Template.resetPassword.helpers({
   recoveryToken : function(){
       var token = FlowRouter.getParam('token');
       return token ? token : false;
   }
});