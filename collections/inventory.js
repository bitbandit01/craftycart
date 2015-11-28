Inventory = new Meteor.Collection('inventory');

Schema.inventory = new SimpleSchema({
    sku : {
        type : String,
        min : 0,
        max: 12,
        unique: true
    },
    size : {
        type : String
    },
    product : {
        type : String,
    },
    gtin13 : {
        type : String,
        optional : true
    },
    inStock : {
        type : Number,
        defaultValue : 0
    },
    price : {
        type : Number
    },
    available : {
        type : Boolean,
        defaultValue : false
    }
});

Inventory.attachSchema(Schema.inventory);