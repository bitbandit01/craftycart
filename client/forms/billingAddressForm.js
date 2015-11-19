Template.billingAddressForm.onRendered(function(){
    $("#billingAddressForm").validate({
        rules: {
            firstName : {
                required : true
            },
            surname : {
                required : true
            },
            address1 : {
                required : true
            },
            town : {
                required : true
            },
            postcode : {
                required : {
                    //required for countries except Ireland
                    depends : function(element){
                        return !!($('select[name=country]').val() != 'Ireland');
                    }
                }                
            }
        },
    });
});

Template.billingAddressForm.helpers({
    countries : function(){
        var allowed = Schema.address._schema.country.allowedValues;
        return _.map(allowed, function(val){
            return { text : val, value : val };
        });
    }
});

Template.billingAddressForm.events({
    'change select[name=country]' : function(e, tmpl){  //Country specific modifications to the form
        var country = $('select[name=country]').val();
        //Hide the postcode field for Irish customers
        if(country == 'Ireland'){
            $('input[name=postcode]').val('');
            $('label[for=postcode]').hide();
        }else{
            $('label[for=postcode]').show();
        }
    }
})