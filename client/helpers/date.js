Template.registerHelper('formatDate', function(val){
    //Use moment for nicely formatted dates
    return moment(val).format("DD/MM/YYYY HH:ss");
});