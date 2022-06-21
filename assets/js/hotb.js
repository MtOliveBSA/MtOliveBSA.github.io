$(document).ready(function () {
	$("#footer").load("../assets/templates/newsletter-footer.html");
	
	if(!$.inFrame()){
		$("#navbar-menu").load("../assets/templates/hotb-menu.html");
	} else {
		//$(".account-links").remove();  //destroy duplicate account/unsubscribe links
		$.ajax({ type: "GET",   
			url: "../assets/templates/hotb-menu.html",   
			success : function(menu){
				$('#navbar-menu').append(menu);
				$("ul.sidebar-nav a").attr("target", "_parent");
			}
		});
	}
	
	//populate archive
	$.ajax({
		url: "../assets/data/archive-hotb.json"
	}).done(function(data){
		var root = $("ul.archive");
		$(data).each(function(i, year){
			var yearEl = $('<li> \
								<a href="' + year.path + '">' + year.year + '</a> \
							</li>');
			root.append(yearEl);
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
			$('#page-wrapper').toggleClass('toggled');
	});

	$(document).on('click', '.nav .dropdown-manual', function (e) {
		e.stopPropagation();
	});
});