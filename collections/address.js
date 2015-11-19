SimpleSchema.debug = true;

Schema.address = new SimpleSchema({
    id : {
        type : Number,
        autoValue : function(){
            //Only set it if not already present
            if(Meteor.isServer && !this.isSet){
                return incrementCounter('counters', 'addressCounter');
            }
        },
        optional : true
    },
    type : {
        type : String,
        allowedValues : ['Billing', 'Shipping']
    },
    isDefault : {
        type : Boolean,
        optional : true,
        defaultValue : false
    },
    company : {
        type : String,
        optional : true,
    },
    firstName : {
        type : String,
    },
    surname : {
        type : String,
    },
    address1 : {
        type : String,
    },
    address2 : {
        type : String,
        optional : true
    },
    address3 : {
        type : String,
        optional : true
    },
    town : {
        type : String,
    },
    county : {
        type : String,
        optional : true
    },
    postcode : {
        type : String,
        optional : true
    },
    country : {
        type : String,
        allowedValues : ['United Kingdom', 'Ireland', 'France']
    },
    telephone : {
        type : String,
        optional : true
    }
});