/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init Progress Bars
5. Init Accordions
6. Initialize Milestones
7. Init Loaders
8. Init Search Form


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
	initProgressBars();
	initAccordions();
	initMilestones();
	initLoaders();
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

	4. Init Progress Bars

	*/

	function initProgressBars()
	{
		if($('.skill_bars').length)
		{
			var bars = $('.skill_bars');

			bars.each(function()
			{
				var ele = $(this);
	    		var elePerc = ele.data('perc');
	    		var eleName = '#' + ele.attr('id');
	    		var color = "#fa9e1b";
	    		if(ele.attr('data-color'))
	    		{
	    			color = ele.attr('data-color');
	    		}
	    		var statsScene = new ScrollMagic.Scene({
		    		triggerElement: this,
		    		triggerHook: 'onEnter',
		    		reverse:false
		    	})
		    	.on('start', function()
		    	{
		    		var pbar = new ProgressBar.Line(eleName, 
		    		{
		    			strokeWidth: 1,
						easing: 'easeInOut',
						duration: 1400,
						color: color,
						trailColor: '#e1e1e1',
						trailWidth: 1,
						svgStyle: {display: 'block', width: '100%', height: '100%'},
						text: {
							style: {
								// Text color.
								// Default: same as stroke color (options.color)
								fontFamily: 'Open Sans',
								textAlign: 'right',
								fontSize: '14px',
								width: '40px',
								color: '#1a1a1a',
								position: 'absolute',
								left: 'calc' + '(' + (elePerc * 100) + '% - 40px' + ')',
								top: '-39px',
								padding: 0,
								margin: 0,
								transform: null
								},
								autoStyleContainer: false
						},
						step: function(state, bar) {
						bar.setText('+' + Math.round(bar.value() * 100) + ' %');
						}
		    		});
		    		pbar.animate(elePerc);
		    	})
		    	.addTo(ctrl);
			})
		}
	}

	/* 

	5. Init Accordions

	*/

	function initAccordions()
	{
		if($('.accordion').length)
		{
			var accs = $('.accordion');

			accs.each(function()
			{
				var acc = $(this);

				if(acc.hasClass('active'))
				{
					var panel = $(acc.next());
					var panelH = panel.prop('scrollHeight') + "px";
					
					if(panel.css('max-height') == "0px")
					{
						panel.css('max-height', panel.prop('scrollHeight') + "px");
					}
					else
					{
						panel.css('max-height', "0px");
					} 
				}

				acc.on('click', function()
				{
					if(acc.hasClass('active'))
					{
						acc.removeClass('active');
						var panel = $(acc.next());
						var panelH = panel.prop('scrollHeight') + "px";
						
						if(panel.css('max-height') == "0px")
						{
							panel.css('max-height', panel.prop('scrollHeight') + "px");
						}
						else
						{
							panel.css('max-height', "0px");
						} 
					}
					else
					{
						acc.addClass('active');
						var panel = $(acc.next());
						var panelH = panel.prop('scrollHeight') + "px";
						
						if(panel.css('max-height') == "0px")
						{
							panel.css('max-height', panel.prop('scrollHeight') + "px");
						}
						else
						{
							panel.css('max-height', "0px");
						} 
					}
				});
			});
		}
	}

	/* 

	6. Initialize Milestones

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

	7. Init Loaders

	*/

	function initLoaders()
	{
		if($('.loader').length)
		{
			var loaders = $('.circle');

			loaders.each(function()
			{
				var loader = $(this);
				var endValue = $(loader).data('perc');

				var loaderScene = new ScrollMagic.Scene({
		    		triggerElement: this,
		    		triggerHook: 'onEnter',
		    		reverse:false
		    	})
		    	.on('start', function()
		    	{
		    		loader.circleProgress({
						startAngle: 4.66,
						thickness: 3,
						size: 176,
						emptyFill:"transparent",
						fill: {gradient:["#fa9e1b", "#8d4fff"]},
					}).on('circle-animation-progress', function(event, progress, stepValue)
						{
							$(this).find('strong').text(Math.round(stepValue * 100) + "%");
						});
		    	})
			    .addTo(ctrl);
			});
		}
	}

	/* 

	8. Init Search Form

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