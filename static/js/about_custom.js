/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init Stats
5. Initialize Milestones
6. Init Search Form


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
	var ctrl = new ScrollMagic.Controller();
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
	initStats();
	initMilestones();
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

	4. Init Stats

	*/

	function initStats()
	{
		if($('.stats_item').length)
		{
			//Get all elements with .stats_item class
			var statsItems = $('.stats_item');

			//Go through each .stats_item
			statsItems.each(function()
			{
				//Get .stats_bar that is inside the .stats_item
				var item = $(this).find('.stats_bar');
				//Get the element that is going to show the percentage in graph
				var perc = item.find('.stats_bar_perc');
				//Get the element that is going to show the percentage in number
				var val = item.find('.stats_bar_value');
				//Get the first value
				var x = item.attr("data-x");
				//Get the second value
				var y = item.attr("data-y");
				//Get the percentage bar color
				var clr = item.attr("data-color");

				//Get the percentage increase/decrease
				var xPerc = Math.round(((y - x) / x) * 100);
				//If it's a positive value
				if(xPerc > 0)
				{
					var percBarWidth = xPerc;
					if(xPerc > 100)
					{
						percBarWidth = 100;
					}
					perc.css('left', "50%");
					perc.css('width', percBarWidth / 2 + "%");
					val.text("+" + xPerc + "%");
					val.css('left', "0");
					val.css('text-align', "left");
				}
				//If it's a negative value
				else
				{
					xPerc = Math.abs(xPerc);
					var percBarWidth = xPerc;
					if(xPerc > 100)
					{
						percBarWidth = 100;
					}
					perc.css('right', "50%");
					perc.css('width', percBarWidth / 2 + "%");
					val.text("-" + xPerc + "%");
					val.css('right', "0");
					val.css('text-align', "right");
				}
				perc.css('background', clr);
			});
		}
	}

	/* 

	5. Initialize Milestones

	*/

	function initMilestones()
	{
		if($('.milestone_counter').length)
		{
			var milestoneItems = $('.milestone_counter');

	    	milestoneItems.each(function(i)
	    	{
	    		var ele = $(this);
	    		var endValue = ele.data('end-value');
	    		var eleValue = ele.text();

	    		/* Use data-sign-before and data-sign-after to add signs
	    		infront or behind the counter number */
	    		var signBefore = "";
	    		var signAfter = "";

	    		if(ele.attr('data-sign-before'))
	    		{
	    			signBefore = ele.attr('data-sign-before');
	    		}

	    		if(ele.attr('data-sign-after'))
	    		{
	    			signAfter = ele.attr('data-sign-after');
	    		}

	    		var milestoneScene = new ScrollMagic.Scene({
		    		triggerElement: this,
		    		triggerHook: 'onEnter',
		    		reverse:false
		    	})
		    	.on('start', function()
		    	{
		    		var counter = {value:eleValue};
		    		var counterTween = TweenMax.to(counter, 4,
		    		{
		    			value: endValue,
		    			roundProps:"value", 
						ease: Circ.easeOut, 
						onUpdate:function()
						{
							document.getElementsByClassName('milestone_counter')[i].innerHTML = signBefore + counter.value + signAfter;
						}
		    		});
		    	})
			    .addTo(ctrl);
	    	});
		}
	}

	/* 

	6. Init Search Form

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