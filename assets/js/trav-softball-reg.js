var config = {
    division: null,
    selects: []
};

//Setup Division calc
config.division = $("#select10 select").get(0);
$(config.division).prop("disabled", true);

//Re-Enable Field Prior to Submit so form submission works for sub-total value
$('form').submit(function(e) {
    $(':disabled').each(function(e) {
        $(this).removeAttr('disabled');
    })
});

//Birthdate
$("#date9 select[name$=_YY]").each(function(i,o){
    var select = $(o);
    config.selects.push(select);

	select.change(function(){
		switch(this.value){
            case "2008":
            case "2009":    config.division.val("14U"); break;
            case "2010":
            case "2011":    config.division.val("12U"); break;
            case "2012":
            case "2013":    config.division.val("10U"); break;
            case "2014":
            case "2015":
            case "2016":    config.division.val("8U"); break;
            default:        config.division.val("-");
        }
	});
});