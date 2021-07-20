//Add sponsor carousel
var sponsors = [];
$("<div id=\"sponsor_roll_container\"><div class=\"sponsor_roll\"></div></div>").appendTo($("#sponsors"));
$.ajax({
    "url": "https://www.leaguelineup.com/websponsors.asp?url=mojbsa",
    "dataType": "html",
    "crossDomain": true,
    "success": function(resp){ 
        $(resp).find("table a").each(function(i,o){
            var r = {};
            var el = $(o).find("img").get(0);
            r.href = $(o).attr("href");
            r.name = $(el).attr("alt");
            r.img = $(el).attr("src");
            sponsors.push(r);
            $("<div><a href=\"" + r.href + "\" target=\"_blank\"><img src=\"" + r.img + "\" alt=\"" + r.name + "\" /></a></div>").appendTo($(".sponsor_roll"));
        });

        $('.sponsor_roll').slick({
            autoplay: true,
            autoplaySpeed: 2000,
            //arrows: false,
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
    }
});