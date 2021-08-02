/*
	Directive by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '981px',   '1280px' ],
			narrow:    [ '841px',   '980px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ '481px',   '736px'  ],
			mobilep:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

})(jQuery);

$(document).ready(function () {
	//populate archive
	$.ajax({
		url: "/newsletters/archive.json"
	}).done(function(data){
		var num2month = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
		var root = $("ul.archive");
		$(data).each(function(i, year){
			var yearEl = $('<li><a class="toggle" href="javascript:void(0);">' + year.year + '"</a></li>');
			root.append(yearEl);
			$(year.months).each(function(i, month){
				var monthEl = $('<ul class="inner"> \
									<a class="toggle" href="javascript:void(0);">' + num2month[month.month] + '</a> \
									<ul class="inner"></ul> \
								</ul>');
				yearEl.append(monthEl);
				$(month.articles).each(function(i, article){
					if(article.active)
						$('<li><a href="#">' + ( article.title ? article.title : article.date ) + '</a></li>').appendTo(monthEl);
				})
			})
		})
	});
	
	$('.toggle').click(function(e) {
		e.preventDefault();

		var $this = $(this);

		if ($this.next().hasClass('show')) {
			$this.next().removeClass('show');
			$this.next().slideUp(350);
		} else {
			$this.parent().parent().find('li .inner').removeClass('show');
			$this.parent().parent().find('li .inner').slideUp(350);
			$this.next().toggleClass('show');
			$this.next().slideToggle(350);
		}
	});
	
	var trigger = $('.hamburger'),
		overlay = $('.overlay'),
		isClosed = false;

		trigger.click(function (){
			hamburger_cross();      
		});

		function hamburger_cross() {

		if (isClosed == true) {          
			overlay.hide();
			trigger.removeClass('is-open');
			trigger.addClass('is-closed');
			isClosed = false;
		} else {   
			overlay.show();
			trigger.removeClass('is-closed');
			trigger.addClass('is-open');
			isClosed = true;
		}
	}
	
	$('[data-toggle="offcanvas"]').click(function (){
			$('#wrapper').toggleClass('toggled');
	});

	$(document).on('click', '.nav .dropdown-manual', function (e) {
		e.stopPropagation();
	});
});