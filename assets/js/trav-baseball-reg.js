var config = {
    division: null,
    selects: {
        month: null,
        day: null,
        year: null
    },
    dates: {
        convert:function(d) {
            // Converts the date in d to a date-object. The input can be:
            //   a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //   a number     : Interpreted as number of milliseconds
            //                  since 1 Jan 1970 (a timestamp) 
            //   a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date
            //                  attributes.  **NOTE** month is 0-11.
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );
        },
        compare:function(a,b) {
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                isFinite(a=this.convert(a).valueOf()) &&
                isFinite(b=this.convert(b).valueOf()) ?
                (a>b)-(a<b) :
                NaN
            );
        },
        inRange:function(d,start,end) {
            // Checks if date in d is between dates in start and end.
            // Returns a boolean or NaN:
            //    true  : if d is between start and end (inclusive)
            //    false : if d is before start or after end
            //    NaN   : if one or more of the dates is illegal.
            // NOTE: The code inside isFinite does an assignment (=).
           return (
                isFinite(d=this.convert(d).valueOf()) &&
                isFinite(start=this.convert(start).valueOf()) &&
                isFinite(end=this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
            );
        }
    },
    calcDivision: function(){
        if( config.selects.year.value == "0"
            || config.selects.month.value =="0" 
            || config.selects.day.value == "0" )
            return false;

        var date = new Date([config.selects.year.value, config.selects.month.value, config.selects.day.value].join("-"));
    
        if(config.dates.inRange(date, config.dates.convert("2010-04-30"), config.dates.convert("2011-04-30")))
            $(config.division).val("12U");
        else if(config.dates.inRange(date, config.dates.convert("2011-04-30"), config.dates.convert("2012-04-30")))
            $(config.division).val("11U");
        else if(config.dates.inRange(date, config.dates.convert("2012-04-30"), config.dates.convert("2013-04-30")))
            $(config.division).val("10U");
        else if(config.dates.inRange(date, config.dates.convert("2013-04-30"), config.dates.convert("2014-04-30")))
            $(config.division).val("9U");
        else if(config.dates.inRange(date, config.dates.convert("2014-04-30"), config.dates.convert("2015-04-30")))
            $(config.division).val("8U");
        else if(config.dates.inRange(date, config.dates.convert("2015-04-30"), config.dates.convert("2016-04-30")))
            $(config.division).val("7U");
        else
            $(config.division).val("-");
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
    config.selects.month = select[0];

	select.change(function(){
		config.calcDivision();
	});
});

$("#date9 select[name$=_DD]").each(function(i,o){
    var select = $(o);
    config.selects.day = select[0];

	select.change(function(){
		config.calcDivision();
	});
});

$("#date9 select[name$=_YY]").each(function(i,o){
    var select = $(o);
    config.selects.year = select[0];

	select.change(function(){
		config.calcDivision();
	});
});