var config = {
    items: [
        { "type": "sweatshirt", "price": 35, "purchaseFlg": false, "personalizeFlg": false },
        { "type": "tShirt", "price": 16, "purchaseFlg": false, "personalizeFlg": false },
        { "type": "longSleeveShirt", "price": 25, "purchaseFlg": false, "personalizeFlg": false },
        { "type": "reglanShit", "price": 22, "purchaseFlg": false, "personalizeFlg": false },
        { "type": "windbreaker", "price": 40, "purchaseFlg": false, "personalizeFlg": false },
        { "type": "batBag", "price": 60, "purchaseFlg": false, "personalizeFlg": false },
    ],

    subTotal: null,
    purchaseSelects: [],
    personalizationSelects: [],

    recalc: function(){
        var subTotal = 0;
        $(config.purchaseSelects).each(function(i,o){
            if($(this).val() == "Yes")
                subTotal += config.items[i].price;
        });
        $(config.personalizationSelects).each(function(i,o){
            if($(this).val() == "Yes")
                subTotal += 5;
        });

        $(config.subTotal).val("$" + subTotal);
    }
};

//Sub-Total
config.subTotal = $("input", $(".control-label").filter(function(idx){
    return $(this).html() == "Sub-Total:";
}).parent());
$(config.subTotal).val("$0").prop("disabled", true);

var submitBtn = $("input[type='Submit']");
var _origSubmitFunc = submitBtn.click;
submitBtn.click(function(){
    $(config.subTotal).val("$0").prop("disabled", false);
    _origSubmitFunc();
});


//Purchase Fields
$(".control-label").filter(function(idx){
    return $(this).html() == "Purchase:";
}).parent().each(function(i,o){
    var select = $("select", o);
    config.purchaseSelects.push(select);

	var fields = [];
	var next = $(o).next();
	while(next != null) {
		fields.push(next);
		next.hide();
		
		next = $(next).next();
		var endFound = $("label", next).filter(function(){
			return $(this).html() == "Personalization:";
		}).length;

		if(!next.hasClass("form-group") || endFound){
			fields.push(next);
			next.hide();
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

//Personalization Fields
$(".control-label").filter(function(idx){
    return $(this).html() == "Personalization:";
}).parent().each(function(i,o){
    var select = $("select", o);
    config.personalizationSelects.push(select);

    var lastName = $(o).next();
    var number = $(o).next().next();
    lastName.hide();
    number.hide();
    
	select.change(function(){
		if(this.value == "Yes"){
			lastName.show();
			number.show();
            config.recalc();
		} else {
			lastName.hide();
			number.hide();
            config.recalc();
		}
	});
});