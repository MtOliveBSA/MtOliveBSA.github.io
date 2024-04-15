//last updated 2021-07-28
var root_path = document_root_path ? document_root_path : "../..";
$.ajax({
	url: root_path + "/assets/data/sponsors.json"
}).done(function(sponsors){
	//Add sponsor carousel
	$("<div class=\"sponsor_roll\"></div>").appendTo($("#sponsor_roll_container"));
	
	$($.grep(sponsors, function(n, i){ return n.active == true; })).each(function(i, r){
		$("<div><a href=\"" + r.href + "\" target=\"_blank\"><img src=\"" + r.img + "\" alt=\"" + r.name + "\" /></a></div>").appendTo($(".sponsor_roll"));
	});

	$('.sponsor_roll').slick({
		autoplay: true,
		autoplaySpeed: 2000,
		arrows: true,
		initialSlide: Math.floor(Math.random() * sponsors.length),
		variableWidth: true,
		centerMode: true,
		centerPadding: '60px',
		slidesToShow: 3,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					arrows: false,
					centerMode: true,
					centerPadding: '40px',
					slidesToShow: 3
				}
			},
			{
				breakpoint: 480,
				settings: {
					arrows: false,
					centerMode: true,
					centerPadding: '40px',
					slidesToShow: 1
				}
			}
		]
	});
});
