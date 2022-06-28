var config = {
    division: null,
    selects: {
        month: null,
        day: null,
        year: null
    },
    calcDivision: function(){
        var date = new Date([config.selects.year, config.select.month, config.select.day].join("-"));
        
        if(date >= (new Date("2010-04-30")) && date < (new Date("2011-04-30")))
            $(config.division).val("12U");
        else if(date >= (new Date("2011-04-30")) && date < (new Date("2012-04-30")))
            $(config.division).val("11U");
        else if(date >= (new Date("2012-04-30")) && date < (new Date("2013-04-30")))
            $(config.division).val("10U");
        else if(date >= (new Date("2013-04-30")) && date < (new Date("2014-04-30")))
            $(config.division).val("9U");
        else if(date >= (new Date("2014-04-30")) && date < (new Date("2015-04-30")))
            $(config.division).val("8U");
        else if(date >= (new Date("2015-04-30")) && date < (new Date("2016-04-30")))
            $(config.division).val("7U");
    }
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
$("#date9 select[name$=_MM]").each(function(i,o){
    var select = $(o);
    config.selects.month = select;

	select.change(function(){
		config.calcDivision();
	});
});

$("#date9 select[name$=_DD]").each(function(i,o){
    var select = $(o);
    config.selects.day = select;

	select.change(function(){
		config.calcDivision();
	});
});

$("#date9 select[name$=_YY]").each(function(i,o){
    var select = $(o);
    config.selects.year = select;

	select.change(function(){
		config.calcDivision();
	});
});