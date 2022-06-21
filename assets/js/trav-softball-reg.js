var config = {
    division: null,
    selects: []
};

//Setup Division calc
config.division = $("input", $(".control-label").filter(function(idx){
    return $(this).html() == "Division:";
}).parent()).get(0);
$(config.division).prop("disabled", true);

//Re-Enable Field Prior to Submit so form submission works for sub-total value
$('form').submit(function(e) {
    $(':disabled').each(function(e) {
        $(this).removeAttr('disabled');
    })
});

//Birthdate
$(".control-label").filter(function(idx){
    return $(this).html() == "Birthdate:";
}).parent().each(function(i,o){
    var select = $("select", o);
    config.selects.push(select);

    debugger;
    
	select.change(function(){
		console.debug("update division....");
	});
});