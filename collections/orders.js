Orders = new Meteor.Collection('orders');

Schema.orderSchema = new SimpleSchema([
    Schema.cartMetaSchema, {
        orderNum : {
            type : String,
            autoValue : function(){
                //Only set it if not already present
                if(Meteor.isServer && !this.isSet){
                    return Meteor.hashid();
                }
            },
        },
        cart : {
            type : [Object]
        },
        'cart.$.item' : {
            type : String
        },
        'cart.$.name' : {
            type : String
        },
        'cart.$.qty' : {
            type : Number
        },
        'cart.$.price' : {
            type : Number,
        },
        paymentMethod : {
            type : String
        },
        transactionId : {
            type : String
        },
        createdAt : {
            type : Date
        }
    }
]);
    
Orders.attachSchema(Schema.orderSchema);