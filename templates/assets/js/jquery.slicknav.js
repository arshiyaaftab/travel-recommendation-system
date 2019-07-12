/*!
	SlickNav Responsive Mobile Menu
	(c) 2014 Josh Cope
	licensed under MIT
*/
;(function (jQuery, document, window) {
	var
	// default settings object.
	defaults = {
		label: 'MENU',
		duplicate: true,
		duration: 200,
		easingOpen: 'swing',
		easingClose: 'swing',
		closedSymbol: '&#9658;',
		openedSymbol: '&#9660;',
		prependTo: 'body',
		parentTag: 'a',
		closeOnClick: false,
		allowParentLinks: false,
		init: function(){},
		open: function(){},
		close: function(){}
	},
	mobileMenu = 'slicknav',
	prefix = 'slicknav';
	
	function Plugin( element, options ) {
		this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = jQuery.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = mobileMenu;
        
        this.init();
	}
	
	Plugin.prototype.init = function () {
        var jQuerythis = this;
		var menu = jQuery(this.element);
		var settings = this.settings;
		
		// clone menu if needed
		if (settings.duplicate) {
			jQuerythis.mobileNav = menu.clone();
			//remove ids from clone to prevent css issues
			jQuerythis.mobileNav.removeAttr('id');
			jQuerythis.mobileNav.find('*').each(function(i,e){
				jQuery(e).removeAttr('id');
			});
		}
		else
			jQuerythis.mobileNav = menu;
		
		// styling class for the button
		var iconClass = prefix+'_icon';
		
		if (settings.label == '') {
			iconClass += ' '+prefix+'_no-text';
		}
		
		if (settings.parentTag == 'a') {
			settings.parentTag = 'a href="#"';
		}
		
		// create menu bar
		jQuerythis.mobileNav.attr('class', prefix+'_nav');
		var menuBar = jQuery('<div class="'+prefix+'_menu hidden-lg"></div>');
		jQuerythis.btn = jQuery('<'+settings.parentTag+' aria-haspopup="true" tabindex="0" class="'+prefix+'_btn '+prefix+'_collapsed"><span class="'+prefix+'_menutxt">'+settings.label+'</span><span class="'+iconClass+'"><span class="'+prefix+'_icon-bar"></span><span class="'+prefix+'_icon-bar"></span><span class="'+prefix+'_icon-bar"></span></span></a>');
		jQuery(menuBar).append(jQuerythis.btn);		
		jQuery(settings.prependTo).prepend(menuBar);
		menuBar.append(jQuerythis.mobileNav);
		
		// iterate over structure adding additional structure
		var items = jQuerythis.mobileNav.find('li');
		jQuery(items).each(function () {
			var item = jQuery(this);
			data = {};
			data.children = item.children('ul').attr('role','menu');
			item.data("menu", data);
			
			// if a list item has a nested menu
			if (data.children.length > 0) {
			
				// select all text before the child menu
				var a = item.contents();
				var nodes = [];
				jQuery(a).each(function(){
					if(!jQuery(this).is("ul")) {
						nodes.push(this);
					}
					else {
						return false;
					}
				});
				
				// wrap item text with tag and add classes
				var wrap = jQuery(nodes).wrapAll('<'+settings.parentTag+' role="menuitem" aria-haspopup="true" tabindex="-1" class="'+prefix+'_item"/>').parent();
				
				item.addClass(prefix+'_collapsed');
				item.addClass(prefix+'_parent');
				
				// create parent arrow
				jQuery(nodes).last().after('<span class="'+prefix+'_arrow">'+settings.closedSymbol+'</span>');
				
			
			} else if ( item.children().length == 0) {
				 item.addClass(prefix+'_txtnode');
			}
			
			// accessibility for links
			item.children('a').attr('role', 'menuitem').click(function(){
				//Emulate menu close if set
				if (settings.closeOnClick)
					jQuery(jQuerythis.btn).click();
			});
		});
		
		// structure is in place, now hide appropriate items
		jQuery(items).each(function () {
			var data = jQuery(this).data("menu");
			jQuerythis._visibilityToggle(data.children, false, null, true);
		});
		
		// finally toggle entire menu
		jQuerythis._visibilityToggle(jQuerythis.mobileNav, false, 'init', true);
		
		// accessibility for menu button
		jQuerythis.mobileNav.attr('role','menu');
		
		// outline prevention when using mouse
		jQuery(document).mousedown(function(){
			jQuerythis._outlines(false);
		});
		
		jQuery(document).keyup(function(){
			jQuerythis._outlines(true);
		});
		
		// menu button click
		jQuery(jQuerythis.btn).click(function (e) {
			e.preventDefault();
			jQuerythis._menuToggle();			
		});
		
		// click on menu parent
		jQuerythis.mobileNav.on('click', '.'+prefix+'_item', function(e){
			e.preventDefault();
			jQuerythis._itemClick(jQuery(this));
		});
		
		// check for enter key on menu button and menu parents
		jQuery(jQuerythis.btn).keydown(function (e) {
			var ev = e || event;
			if(ev.keyCode == 13) {
				e.preventDefault();
				jQuerythis._menuToggle();
			}
		});
		
		jQuerythis.mobileNav.on('keydown', '.'+prefix+'_item', function(e) {
			var ev = e || event;
			if(ev.keyCode == 13) {
				e.preventDefault();
				jQuerythis._itemClick(jQuery(e.target));
			}
		});
		
		// allow links clickable within parent tags if set
		if (settings.allowParentLinks) {
			jQuery('.'+prefix+'_item a').click(function(e){
					e.stopImmediatePropagation();
			});
		}
    };
	
	//toggle menu
	Plugin.prototype._menuToggle = function(el){
		var jQuerythis = this;
		var btn = jQuerythis.btn;
		var mobileNav = jQuerythis.mobileNav;
		
		if (btn.hasClass(prefix+'_collapsed')) {
			btn.removeClass(prefix+'_collapsed');
			btn.addClass(prefix+'_open');
		} else {
			btn.removeClass(prefix+'_open');
			btn.addClass(prefix+'_collapsed');
		}
		btn.addClass(prefix+'_animating');
		jQuerythis._visibilityToggle(mobileNav, true, btn);
	}
	
	// toggle clicked items
	Plugin.prototype._itemClick = function(el) {
		var jQuerythis = this;
		var settings = jQuerythis.settings;
		var data = el.data("menu");
		if (!data) {
			data = {};
			data.arrow = el.children('.'+prefix+'_arrow');
			data.ul = el.next('ul');
			data.parent = el.parent();
			el.data("menu", data);
		}
		if (data.parent.hasClass(prefix+'_collapsed')) {
			data.arrow.html(settings.openedSymbol);
			data.parent.removeClass(prefix+'_collapsed');
			data.parent.addClass(prefix+'_open');
			data.parent.addClass(prefix+'_animating');
			jQuerythis._visibilityToggle(data.ul, true, el);
		} else {
			data.arrow.html(settings.closedSymbol);
			data.parent.addClass(prefix+'_collapsed');
			data.parent.removeClass(prefix+'_open');
			data.parent.addClass(prefix+'_animating');
			jQuerythis._visibilityToggle(data.ul, true, el);
		}
	}

	// toggle actual visibility and accessibility tags
	Plugin.prototype._visibilityToggle = function(el, animate, trigger, init) {
		var jQuerythis = this;
		var settings = jQuerythis.settings;
		var items = jQuerythis._getActionItems(el);
		var duration = 0;
		if (animate)
			duration = settings.duration;
		
		if (el.hasClass(prefix+'_hidden')) {
			el.removeClass(prefix+'_hidden');
			el.slideDown(duration, settings.easingOpen, function(){
				
				jQuery(trigger).removeClass(prefix+'_animating');
				jQuery(trigger).parent().removeClass(prefix+'_animating');
				
				//Fire open callback
				if (!init) {
					settings.open(trigger);
				}
			});
			el.attr('aria-hidden','false');
			items.attr('tabindex', '0');
			jQuerythis._setVisAttr(el, false);
		} else {
			el.addClass(prefix+'_hidden');
			el.slideUp(duration, this.settings.easingClose, function() {
				el.attr('aria-hidden','true');
				items.attr('tabindex', '-1');
				jQuerythis._setVisAttr(el, true);
				el.hide(); //jQuery 1.7 bug fix
				
				jQuery(trigger).removeClass(prefix+'_animating');
				jQuery(trigger).parent().removeClass(prefix+'_animating');
				
				//Fire init or close callback
				if (!init)
					settings.close(trigger);
				else if (trigger == 'init')
					settings.init();
			});
		}
	}

	// set attributes of element and children based on visibility
	Plugin.prototype._setVisAttr = function(el, hidden) {
		var jQuerythis = this;
		
		// select all parents that aren't hidden
		var nonHidden = el.children('li').children('ul').not('.'+prefix+'_hidden');
		
		// iterate over all items setting appropriate tags
		if (!hidden) {
			nonHidden.each(function(){
				var ul = jQuery(this);
				ul.attr('aria-hidden','false');
				var items = jQuerythis._getActionItems(ul);
				items.attr('tabindex', '0');
				jQuerythis._setVisAttr(ul, hidden);
			});
		} else {
			nonHidden.each(function(){
				var ul = jQuery(this);
				ul.attr('aria-hidden','true');
				var items = jQuerythis._getActionItems(ul);
				items.attr('tabindex', '-1');
				jQuerythis._setVisAttr(ul, hidden);
			});
		}
	}

	// get all 1st level items that are clickable
	Plugin.prototype._getActionItems = function(el) {
		var data = el.data("menu");
		if (!data) {
			data = {};
			var items = el.children('li');
			var anchors = items.children('a');
			data.links = anchors.add(items.children('.'+prefix+'_item'));
			el.data("menu", data);
		}
		return data.links;
	}

	Plugin.prototype._outlines = function(state) {
		if (!state) {
			jQuery('.'+prefix+'_item, .'+prefix+'_btn').css('outline','none');
		} else {
			jQuery('.'+prefix+'_item, .'+prefix+'_btn').css('outline','');
		}
	}
	
	Plugin.prototype.toggle = function(){
		jQuerythis._menuToggle();
	}
	
	Plugin.prototype.open = function(){
		jQuerythis = this;
		if (jQuerythis.btn.hasClass(prefix+'_collapsed')) {
			jQuerythis._menuToggle();
		}
	}
	
	Plugin.prototype.close = function(){
		jQuerythis = this;
		if (jQuerythis.btn.hasClass(prefix+'_open')) {
			jQuerythis._menuToggle();
		}
	}
	
	jQuery.fn[mobileMenu] = function ( options ) {
		var args = arguments;

		// Is the first parameter an object (options), or was omitted, instantiate a new instance
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {

				// Only allow the plugin to be instantiated once due to methods
				if (!jQuery.data(this, 'plugin_' + mobileMenu)) {

					// if it has no instance, create a new one, pass options to our plugin constructor,
					// and store the plugin instance in the elements jQuery data object.
					jQuery.data(this, 'plugin_' + mobileMenu, new Plugin( this, options ));
				}
			});

		// If is a string and doesn't start with an underscore or 'init' function, treat this as a call to a public method.
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

			// Cache the method call to make it possible to return a value
			var returns;

			this.each(function () {
				var instance = jQuery.data(this, 'plugin_' + mobileMenu);

				// Tests that there's already a plugin-instance and checks that the requested public method exists
				if (instance instanceof Plugin && typeof instance[options] === 'function') {

					// Call the method of our plugin instance, and pass it the supplied arguments.
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
			});

			// If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
			return returns !== undefined ? returns : this;
		}
	};
}(jQuery, document, window));