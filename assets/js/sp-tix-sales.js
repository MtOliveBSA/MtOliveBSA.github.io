var config = {
    items: [
        { "type": "player", "price": 0 },
        { "type": "non-player", "price": 15 }
    ],

    subTotal: null,
    playerSelects: [],
    nonPlayerSelects: [],

    recalc: function(){
        var subTotal = 0;
        $(config.playerSelects).each(function(i,o){
            if($(this).val() != "0")
                subTotal += Number($(this).val()) * 0;
        });
        $(config.nonPlayerSelects).each(function(i,o){
            if($(this).val() != "0")
                subTotal += Number($(this).val()) * 15;
        });

        $(config.subTotal).val("$" + subTotal).change();
    }
};

//Update payment method logos
$("img[src=\"https://www.leaguelineup.com/images/paypal_creditcards.gif\"]").attr("src", "https://mtolivebsa.github.io/images/payment_methods.gif");

//update payment note for detail
var note = $(".text-danger").filter(function(idx) {
    return this.innerHTML.indexOf("Credit Card information can be entered once this form is submitted") != -1;
}).html("<strong>Note</strong>: Payment information can be entered once this form is submitted. If paying via Venmo or Check, please use the Offline Payment option during checkout");

//Setup Sub-Total Calc
config.subTotal = $("input", $(".control-label").filter(function(idx){
    return $(this).html() == "Sub-Total:";
}).parent()).get(0);
$(config.subTotal).val("$0").prop("disabled", true);

//Re-Enable Field Prior to Submit so form submission works for sub-total value
$('form').submit(function(e) {
    config.recalc();
    $(':disabled').each(function(e) {
        $(this).removeAttr('disabled');
    })
});

//Purchase Fields
$(".control-label").filter(function(idx){
    return $(this).html() == "Number of Player Tickets:";
}).parent().each(function(i,o){
    var select = $("select", o);
    config.purchaseSelects.push(select);

	var fields = [];
    var yesSelected = ( $("select", o).val() == "Yes" );
	var next = $(o).next();
	while(next != null) {
		fields.push(next);
		if(!yesSelected){
            next.hide();
        }
		
		next = $(next).next();
		var endFound = $("label", next).filter(function(){
			return $(this).html() == "Personalization:";
		}).length;

		if(!next.hasClass("form-group") || endFound){
			fields.push(next);
			if(!yesSelected){
                next.hide();
            }
			next = null;
			break;
		}
	}
    
	select.change(function(){
		if(this.value == "Yes"){
			$(fields).each(function(){
				$(this).show();
                config.recalc();
			});
		} else {
			$("select", fields[fields.length - 1]).val("No").change();
            $(fields).each(function(){
				$(this).hide();
                config.recalc();
			});
		}
	});
});