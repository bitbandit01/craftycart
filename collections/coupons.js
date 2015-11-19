Coupons = new Meteor.Collection('coupons');

Schema.coupon = new SimpleSchema({
    coupon : {
        type : String,
    },
    value : {
        type : Number,
    },
    description : {
        type : String,
    }
});

Coupons.attachSchema(Schema.coupon);