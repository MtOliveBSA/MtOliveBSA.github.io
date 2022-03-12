console.debug("Loading from override....");

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

        $(config.subTotal).val("$" + subTotal).change();
    }
};

//Setup Sub-Total Calc
config.subTotal = $("input", $(".control-label").filter(function(idx){
    return $(this).html() == "Sub-Total:";
}).parent()).get(0);
$(config.subTotal).val("$0").prop("disabled", true);

//Re-Enable Field Prior to Submit so form submission works for sub-total value
$('form').submit(function(e) {
    //config.recalc();
    $(':disabled').each(function(e) {
        $(this).removeAttr('disabled');
    })
});

//Purchase Fields
$(".control-label").filter(function(idx){
    return $(this).html() == "Purchase:";
}).parent().each(function(i,o){
    var select = $("select", o);
    config.purchaseSelects.push(select);

	var fields = [];
	debugger;
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

//Clean BR from Merch Image Containers
$(".merch-images-container br").remove();



$.fn.magnifierRentgen = function() {

	return this.each(function() {

		var th        = $(this),
		dataImage     = th.data("image"),
		dataImageZoom = th.data("image-zoom"),
		dataSize      = th.data("size");

		th
		.addClass("magnifierRentgen")
		.resize(function() {
			th.find(".data-image, .magnifier-loupe img").css({
				"width" : th.width()
			})
		})
		.append("<img class='data-image' src='" + dataImage + "'><div class='magnifier-loupe'><img src='" + dataImageZoom + "'>")
			.hover(function() {
				th.find(".magnifier-loupe").stop().fadeIn()
			}, function() {
				th.find(".magnifier-loupe").stop().fadeOut()
			})
			.find(".data-image").css({
				"width" : th.width()
			}).parent().find(".magnifier-loupe").css({
					"width"  : dataSize,
					"height" : dataSize
				})
				.find("img").css({
					"position" : "absolute",
					"width"    : th.width()
				});

		th.mousemove(function(e) {

			var elemPos = {},
				offset  = th.offset();

			elemPos = {
				left : e.pageX - offset.left - dataSize/2,
				top  : e.pageY - offset.top - dataSize/2
			}

			th
			.find(".magnifier-loupe").css({
					"top"  : elemPos["top"],
					"left" : elemPos["left"]
				})
				.find("img").css({
					"top"   : -elemPos["top"],
					"left"  : -elemPos["left"],
					"width" : th.width()
				})

		});

		$(window).resize(function() {
			$(".magnifierRentgen").resize();
		});

	});

};

$(".div").magnifierRentgen();