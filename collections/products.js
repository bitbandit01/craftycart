Products = new Meteor.Collection('products');

Schema.product = new SimpleSchema({
    code : {
        type : String,
        unique : true
    },
    name : {
        type : String
    },
    description : {
        type : String
    },
    publish : {
        type : Boolean,
        defaultValue : false
    }
});

Products.attachSchema(Schema.product);