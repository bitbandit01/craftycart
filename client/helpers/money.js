accounting.settings = {
    currency: { 
        symbol : "£",   // default currency symbol is '$'
        format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal : ".",  // decimal point separator
        thousand: ",",  // thousands separator
        precision : 2   // decimal places
    },
    number: {
		precision : 0,  // default precision on numbers is 0
		thousand: ",",
		decimal : "."
	}
}

Template.registerHelper('formatMoney', function(val){
    //All prices are stored in pence
    return accounting.formatMoney(val/100);
});