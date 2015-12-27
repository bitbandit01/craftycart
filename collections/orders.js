Orders = new Meteor.Collection('orders');

Schema.orderSchema = new SimpleSchema([
    Schema.cartMetaSchema, {
        orderNum : {
            type : String,
            autoValue : function(){
                //Only set on insert/upsert
                if(Meteor.isServer){
                    if(this.isInsert || this.isUpsert){
                        //Only set it if not already present
                        if(!this.isSet){
                            return Meteor.hashid();
                        }
                    }    
                }  
            },
        },
        paymentStatus : {
            type : String,
            allowedValues : ['Pending', 'Paid', 'Part-Refunded', 'Refunded']
        },
        fulfillmentStatus : {
            type : String,
            allowedValues : ['Cancelled', 'Processing', 'Part-Shipped', 'Shipped', 'Returned']
        },
        cart : {
            type : [Object]
        },
        'cart.$.item' : {
            type : String
        },
        'cart.$.sku' : {
            type : String
        },
        'cart.$.name' : {
            type : String
        },
        'cart.$.size' : {
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
        shipments : {
            type : [Object],
            optional : true
        },
        'shipments.$.carrier' : {
            type : String
        },
        'shipments.$.shipmentDate' : {
            type : Date
        },
        'shipments.$.trackingNum' : {
            type : String,
            optional : true
        },
        createdAt : {
            type : Date
        }
    }
]);
    
Orders.attachSchema(Schema.orderSchema);