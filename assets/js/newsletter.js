var root_path = document_root_path ? document_root_path : "../..";
$(document).ready(function () {
	//$("#navbar-menu").load(root_path + "/assets/templates/newsletter-menu.html");
	$("#article-footer").load(root_path + "/assets/templates/newsletter-article-footer.html");
	$("#footer").load(root_path + "/assets/templates/newsletter-footer.html", function(){
		$("#account-links").load(root_path + "/assets/templates/newsletter-account-links.html");
	});

	if(!$.inFrame()){
		$("#navbar-menu").load(root_path + "/assets/templates/newsletter-menu.html");
	} else {
		//$(".account-links").remove();  //destroy duplicate account/unsubscribe links
		$.ajax({ type: "GET",   
			url: root_path + "/assets/templates/newsletter-menu.html",   
			success : function(menu){
				$('#navbar-menu').append(menu);
				$("ul.sidebar-nav a").attr("target", "_parent");
			}
		});
	}

	if(document.location.host === "leaguelineup.com" 
		|| document.location.host === "mtolivebsa.github.io" 
		|| document.location.host === "mobasa.sportssignup.com")
		$.ajax({ type: "GET",   
			url: root_path + "/assets/templates/facebook-messenger.html",   
			success : function(fbPlugin){
				$('body').append(fbPlugin);
			}
		});
	
	//populate archive
	$.ajax({
		url: root_path + "/assets/data/archive.json"
	}).done(function(data){
		var num2month = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
		var root = $("ul.archive");
		$(data).each(function(i, year){
			var yearEl = $('<li> \
								<a class="toggle" href="javascript:void(0);">' + year.year + '</a> \
								<ul class="inner"></ul> \
							</li>');
			root.append(yearEl);
			var innerYearList = $(yearEl.children().get(1));
			$(year.months).each(function(i, month){
				var monthEl = $('<li> \
									<a class="toggle" href="#">' + num2month[month.month] + '</a> \
									<ul class="inner"></ul> \
								</li>');
				innerYearList.append(monthEl);
				var innerMonthList = $(monthEl.children().get(1));
				$(month.articles).each(function(i, article){
					if(article.active)
						$('<li><a href="' + article.path + '">' + ( article.title ? article.title : article.date ) + '</a></li>').appendTo(innerMonthList);
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