/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init Isotope Filtering
5. Init Search
6. Init More Options
7. Init Search Form


******************************/

$(document).ready(function()
{
	"use strict";

	/* 

	1. Vars and Inits

	*/

	var menu = $('.menu');
	var menuActive = false;
	var header = $('.header');
	var searchActive = false;

	setHeader();

	$(window).on('resize', function()
	{
		setHeader();
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	initMenu();
	initIsotopeFiltering();
	initSearch();
	initMoreOptions();
	initSearchForm();

	/* 

	2. Set Header

	*/

	function setHeader()
	{
		if(window.innerWidth < 992)
		{
			if($(window).scrollTop() > 100)
			{
				header.addClass('scrolled');
			}
			else
			{
				header.removeClass('scrolled');
			}
		}
		else
		{
			if($(window).scrollTop() > 100)
			{
				header.addClass('scrolled');
			}
			else
			{
				header.removeClass('scrolled');
			}
		}
		if(window.innerWidth > 991 && menuActive)
		{
			closeMenu();
		}
	}

	/* 

	3. Init Menu

	*/

	function initMenu()
	{
		if($('.hamburger').length && $('.menu').length)
		{
			var hamb = $('.hamburger');
			var close = $('.menu_close_container');

			hamb.on('click', function()
			{
				if(!menuActive)
				{
					openMenu();
				}
				else
				{
					closeMenu();
				}
			});

			close.on('click', function()
			{
				if(!menuActive)
				{
					openMenu();
				}
				else
				{
					closeMenu();
				}
			});

	
		}
	}

	function openMenu()
	{
		menu.addClass('active');
		menuActive = true;
	}

	function closeMenu()
	{
		menu.removeClass('active');
		menuActive = false;
	}

	/* 

	4. Init Isotope Filtering

	*/

    function initIsotopeFiltering()
    {
    	var sortBtn = $('.sort_btn');
    	var filterBtn = $('.filter_btn');

    	if($('.offers_grid').length)
    	{
    		var grid = $('.offers_grid').isotope({
    			itemSelector: '.offers_item',
	            getSortData: {
	            	price: function(itemElement)
	            	{
	            		var priceEle = $(itemElement).find('.offers_price').text().replace( '$', '' );
	            		return parseFloat(priceEle);
	            	},
	            	name: '.offer_name',
	            	stars: function(itemElement)
	            	{
	            		var starsEle = $(itemElement).find('.offers_rating');
	            		var stars = starsEle.attr("data-rating");
	            		return stars;
	            	}
	            },
	            animationOptions: {
	                duration: 750,
	                easing: 'linear',
	                queue: false
	            }
	        });

    		// Sorting
	        sortBtn.each(function()
	        {
	        	$(this).on('click', function()
	        	{
	        		var parent = $(this).parent().parent().find('.sorting_text');
	        		parent.text($(this).text());
	        		var option = $(this).attr('data-isotope-option');
	        		option = JSON.parse( option );
    				grid.isotope( option );
	        	});
	        });

	        // Filtering
	        $('.filter_btn').on('click', function()
	        {
	        	var parent = $(this).parent().parent().find('.sorting_text');
	        	parent.text($(this).text());
		        var filterValue = $(this).attr('data-filter');
  				grid.isotope({ filter: filterValue });
	        });
    	}
    }

    /* 

	5. Init Search

	*/

	function initSearch()
	{
		if($('.search_tab').length)
		{
			$('.search_tab').on('click', function()
			{
				$('.search_tab').removeClass('active');
				$(this).addClass('active');
				var clickedIndex = $('.search_tab').index(this);

				var panels = $('.search_panel');
				panels.removeClass('active');
				$(panels[clickedIndex]).addClass('active');
			});
		}
	}

	/* 

	6. Init More Options

	*/

	function initMoreOptions()
	{
		if($('.more_options').length)
		{
			var triggerEle = $('.more_options_trigger');
			var ele = $('.more_options_list');

			triggerEle.on('click', function(e)
			{
				e.preventDefault();
				triggerEle.toggleClass('active');
				ele.toggleClass('active');

				var panel = ele;
				var panelH = ele.prop('scrollHeight') + "px";
				
				if(panel.css('max-height') == "0px")
				{
					panel.css('max-height', panel.prop('scrollHeight') + "px");
				}
				else
				{
					panel.css('max-height', "0px");
				} 
			});
		}
	}

	/* 

	7. Init Search Form

	*/

	function initSearchForm()
	{
		if($('.search_form').length)
		{
			var searchForm = $('.search_form');
			var searchInput = $('.search_content_input');
			var searchButton = $('.content_search');

			searchButton.on('click', function(event)
			{
				event.stopPropagation();

				if(!searchActive)
				{
					searchForm.addClass('active');
					searchActive = true;

					$(document).one('click', function closeForm(e)
					{
						if($(e.target).hasClass('search_content_input'))
						{
							$(document).one('click', closeForm);
						}
						else
						{
							searchForm.removeClass('active');
							searchActive = false;
						}
					});
				}
				else
				{
					searchForm.removeClass('active');
					searchActive = false;
				}
			});	
		}
	}
});