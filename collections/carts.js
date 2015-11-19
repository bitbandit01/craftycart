CartsMeta = new Meteor.Collection('metaCarts');
Carts = new Meteor.Collection('carts');

Schema.cartMetaSchema = {
    'sessionId' : {
        type : String
    },
    'userId' : {
        type : String,
        optional : true
    },
    'subtotal' : {
        type : Number
    },
    'shipping' : {
        type : Number
    },
    'coupon' : {
        type : String,
        optional : true
    },
    'discountAmount' : {
        type : String
    },
    'discountValue' : {
        type : Number
    },
    'vat' : {
        type : Number
    },
    'total' : {
        type : Number
    },
    'billingAddress' : {
        type : Schema.address
    },
    'shippingAddress' : {
        type : Schema.address
    }
};

Schema.cartSchema = {
    'sessionId' : {
        type : String
    },
    'userId' : {
        type : String,
        optional : true
    },
    'item' : {
        type : Object,
        blackbox : true
    },
    'qty' : {
        type : Number,
        defaultValue: 1
    },
    'createdAt' : {
        type : Date
    }
};


//Carts.attachSchema(Schema.cartSchema);