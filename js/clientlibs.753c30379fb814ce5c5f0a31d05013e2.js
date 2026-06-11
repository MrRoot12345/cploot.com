(function() {

    var init = function() {
        skipToMainContent();
        updateMainContent();
		mobileMenu();
        initTopNav();
        initSSO();
        initSearch();
        initScroll();
        initLinkCollapse();
        initEllipsis();
        initMenuItemExpand();
        initResize();
    };

    var skipToMainContent = function() {

        var curLink = window.location.href;
        var updatedMainContentLink = curLink + "#main";
		$(".skip-to-main-content-link").attr("href", updatedMainContentLink);

        //Focus on Skip To Main Content link and close hamburger menu
        $(".skip-to-main-content-link").focus(function() {
           closeMobileMenu(); 
        });

    };

    var updateMainContent = function() {

        var body1 = $("body > .root > .aem-Grid > .responsivegrid");
        var body2 = $("body > .root > .aem-Grid > .atvi-layout-container");

        if(body1.length > 0) $("body > .root > .aem-Grid > .responsivegrid").wrap("<main id='main'>");
        else if(body2.length > 0) $("body > .root > .aem-Grid > .atvi-layout-container").wrap("<main id='main'>");

    };

    var mobileMenu = function() {

        //Update all <a> to be tabindex=-1
        $("#mobile-dropdown a").attr("tabindex", "-1");

        //Get hamburger menu button
		var $mobileBtn = $(".cod-single-header .cod-header_mobile-button button");

        //On hamburger menu click
        $mobileBtn.on("click", function() {

            //If mobile menu is not expanded
            if($(this).closest(".cod-header_mobile-menu").attr("data-menu") == "close") {

                openMobileMenu($(this));

            }

            else {

                closeMobileMenu();

            }

        });


        //Drop Down
        $(".cod-single-header .cod-header_mobile-dropdown li.dd > a").on("click", function(e) {

            e.preventDefault();


            //Get parent li item
            var $parent = $(this).closest("li.dd");

            //If closed
            if($parent.attr("aria-expanded") == "false") {

                //Close any currently opened drop down menu
            	$("#cod-single-header .cod-header_mobile-menu .cod-header_mobile-dropdown .cod-header_mobile-primary-menu > ul > li.dd[aria-expanded='true']").attr("aria-expanded", "false");

                //Then open
				$parent.attr("aria-expanded", "true");
            }
            //if open
            else {
                //Then close
				$parent.attr("aria-expanded", "false")
            }

        });

        //Hover over top nav item and close the mobile drop down menu
        $("#cod-single-header .cod-header_top-nav nav > ul > li.dd").hover(
            function() {
                closeMobileMenu();
            }
        );

        //Close menu if clicked outside of drop down
        $("body").on("click", function(e) {

            if($(".cod-single-header").is(":visible")) {

            	//Close menu

                const menu = document.querySelector('.cod-single-header .cod-header_mobile-menu');
                const mobileDropDownMenu = document.querySelector('.cod-single-header .cod-header_mobile-dropdown');

                if (!menu.contains(e.target) && e.target !== mobileDropDownMenu) {
                    closeMobileMenu();
                }

				//Close locale

				const localeMenu = document.querySelector('#cod-single-header .cod-header_locale-selector .atvi-locale-selector');
                const localeDropDownMenu = document.querySelector('#cod-single-header .cod-header_locale-selector .atvi-locale-selector .locale-panel');

            	//If locale menu is open
                if($("#cod-single-header .cod-header_locale-selector .atvi-locale-selector .locale-panel").is(":visible")) {
                    if (!localeMenu.contains(e.target) && e.target !== localeDropDownMenu) {
                        closeLocaleMenu();
                    }
                }

            	//Close Account

				const accountMenu = document.querySelector('#cod-single-header .cod-header_sso .logged-in');
                const accountDropDownMenu = document.querySelector('#cod-single-header .cod-header_sso .logged-in ul');

            	//If account menu is open
                if($("#cod-single-header .cod-header_sso .logged-in").attr("aria-expanded") == "true") {
                    if (!accountMenu.contains(e.target) && e.target !== accountDropDownMenu) {
                        closeAccountMenu();
                    }
                }


            }

        });

        //Close menu when user tabs out of drop down menu
        $(".cod-header_primary-logo a").on("focus", function() {
			closeMobileMenu();
        });
    };

    var initTopNav = function(){

        //+ - sign
		$expandArrow = $("#cod-single-header .cod-header_top-nav nav > ul > li .expand-arrow");

        $expandArrow.on("click", function(e) {

            //prevents linking off to url if user clicks on the + / - icon
			e.preventDefault();

            //TO DO: 
            //Find a way to hide the drop down after the drop down is already showing from clicking the +
            //Fix this for touch devices to hide drop down menu when user clicks the "-" on the nav item
            
            /*if($(this).closest("li.dd").hasClass("active")) {

				$(this).closest("li.dd").removeClass("active");
            	$(this).closest("li.dd").find("> ul").hide();

            }

            else {
				$(this).closest("li.dd").addClass("active");
                $(this).closest("li.dd").find("> ul").show();
            }*/

        });

    };

    var ssoTimeout = function() {
        setTimeout(function() {
            if (!(ssobar && ssobar.user && ssobar.user.isAuthenticated && ssobar.user.isLoggedIn)) { 
                updateUsername(); 
            }
        }, 2000);
    };

    var updateUsername = function() {

		try {
            if(window.ssobar.user.isLoggedIn) {

				if(typeof ssobar.user !== "undefined" ) {

                    if(typeof ssobar.user.identities !== "undefined" && ssobar.user.identities.length > 0) {

                        var uName;
                        var identities = ssobar.user.identities;
                        for(var i = 0; i < identities.length; i++) {
                            if(identities[i].provider == "uno") {
                                uName = identities[i].username;
                            }
                        }
            
                        $(".cod-single-header .account-name span").text(uName);
    
                    }
                }

            }
        } catch(e) {}

    };

    var initSSO = function() {

        var sb = window.ssobar;
        if(sb) {
            ssoTimeout();
            sb.onAuthentication(function() {
                clearTimeout(ssoTimeout);
                sb.onReady(updateUsername);
            });
        }

        //Check if user is logged in
		if(ATVI.utils.getCookie("ACT_SSO_COOKIE")) {
           	//User is logged in.
            $("body").addClass("sso-logged-in");
        }

        //Links
        var isPrevOrStage = window.location.host.indexOf("stage") > -1 || window.location.host.indexOf("preview") > -1;
        var curUrlEncode = encodeURIComponent(window.location.href);
        var domain = isPrevOrStage ? "profile-stage" : "profile"
        var loginUrl = "https://" + domain + ".callofduty.com/cod/login?redirectUrl=" + curUrlEncode + "&promo=cer";
        var signUpUrl = "https://" + domain + ".callofduty.com/cod/signup?redirectUrl=" + curUrlEncode + "&promo=cer";
        var signOutUrl = "https://" + domain + ".callofduty.com/do_logout?redirectUrl=" + curUrlEncode;
        var ssoInfoUrl = "https://" + domain + ".callofduty.com/cod/info";
        var ssoPrefsUrl = "https://" + domain + ".callofduty.com/cod/prefs";
        var ssoProfileUrl = "https://" + domain + ".callofduty.com/cod/profile";

        //Populate sso links
        $(".cod-single-header .sso-login").attr("href", loginUrl);
        $(".cod-single-header .sso-signup").attr("href", signUpUrl);
        $(".cod-single-header .sso-logout").attr("href", signOutUrl);
		$(".cod-single-header .sso-info").attr("href", ssoInfoUrl);
        $(".cod-single-header .sso-preference").attr("href", ssoPrefsUrl);
        $(".cod-single-header .sso-profile").attr("href", ssoProfileUrl);

        //Fade in SSO Links now that everything is loaded
        $(".cod-single-header .sso-links").fadeIn();

        //Account name click handler
        $(".cod-single-header .logged-in .account-name").on("click", function() {
            
            //Display account logged-in drop down links
            $(this).closest(".logged-in").toggleClass("active");

            // Get the current value of aria-expanded
            var currentExpandedValue = $(this).closest(".logged-in").attr('aria-expanded');

            
            // Toggle the value (if it's 'false', set to 'true', and vice versa)
            var newExpandedValue = currentExpandedValue === 'false' ? 'true' : 'false';
    
            // Set the new value for aria-expanded
            $(this).closest(".logged-in").attr('aria-expanded', newExpandedValue);
            $(this).find("button").attr("aria-expanded", newExpandedValue);
            
        });

    };

    var initSearch = function() {

        //Get search icon button
		var $searchIcon = $("#cod-single-header .cod-header_search button");

        $searchIcon.on("click", function(e) {

            e.preventDefault();
            
            //If search is not expanded
            if($(".cod-single-header .cod-header_search").attr("aria-expanded") == "false") {

                //Set search as expanded
				$(".cod-single-header .cod-header_search").attr("aria-expanded", "true");
            }
            else {

                //Set search as not expanded
				$(".cod-single-header .cod-header_search").attr("aria-expanded", "false");
            }

        });

        //Query
        var $searchInput = $("#cod-single-header .cod-header_search input");

        $searchInput.on("keyup", function(e) {

            if (e.keyCode === 13) {

				var searchValue = $(this).val();
                var cleanValue = searchValue.toLowerCase().replace(/\s+/g, "+");
				var curUrl = window.location.href;
                var url = $("#cod-single-header .cod-header_search form").attr("action") + "?q=" + cleanValue;
                window.open(url, "_self");

            } 

        });

    };

    var openMobileMenu = function($el) {

        closeLocaleMenu();
        closeSearch();

        //Set as expanded
        $el.closest(".cod-header_mobile-menu").attr("data-menu", "open");
        $(".cod-header_mobile-button button").attr("aria-expanded", "true");

        //Update all <a> to be tabindex=0
		$("#mobile-dropdown a").attr("tabindex", "0");

        $("body").addClass("menu-open");

    };

    var closeMobileMenu = function() {

		$(".cod-single-header .cod-header_mobile-menu").attr("data-menu", "close");
        $(".cod-header_mobile-button button").attr("aria-expanded", "false");

        //Update all <a> to be tabindex=-1
        $("#mobile-dropdown a").attr("tabindex", "-1");

        $("body").removeClass("menu-open");

    };

    var closeLocaleMenu = function() {

		$("#cod-single-header .cod-header_locale-selector .atvi-locale-selector .locale-panel").hide();

    };

    var closeSearch = function() {

		$("#cod-single-header .cod-header_search").attr("aria-expanded", "false");

    };

    var closeAccountMenu = function() {

		$("body.sso-logged-in #cod-single-header .logged-in").attr("aria-expanded", "false");

    };

    var initScroll = function() {

        var $header = $(".cod-single-header header, .cod-pn-back-game");
        var disabled = false;
        var delta = 0;

        var lastScrollTop = 0;

        //page load
        var st = $(this).scrollTop();

        if(st == 0) $header.removeClass("no-gap");

        //on window scroll
        $(window).scroll(function(e) {


            st = $(this).scrollTop();

            //If we are below 1 pixels from the top of the page
            if(st >= 1) {

                //Remove gap between header and top of window
                $header.addClass("no-gap");

                //If the current scroll top is greater than the last position
                if((st - lastScrollTop > delta) && !disabled) {

                    //scrolling down

                    disabled = true;

                    $header.addClass("slideUp");
                    closeMobileMenu(); //close hamburger menu
                    closeLocaleMenu(); //close locale menu

                    disabled = false;

                }
                
                //If current scroll position is less than 30 pixels from the last scroll position
                else if((lastScrollTop - st > delta) && !disabled) {

                    //scroll up

                    disabled = true; 
					$header.removeClass("slideUp");
                    disabled = false;

                }
                
            }
            
            //Else if we are within the top 300 pixels from the top of the page
            else {

                //Add gap between header and top of window
                $header.removeClass("no-gap");

                $header.removeClass("slideUp");
                disabled = false;

            }


            lastScrollTop = st;
        });

    };

    var initLinkCollapse = function() {

        var resizeTimer;

        var $ellipsisDropdownMenu = $(".cod-single-header .cod-header_top-nav nav .nav-ellipsis-dropdown-menu");

        //Create clone links of tap nav items and add them to ellipsis nav menu 
        var topNavLinks = $(".cod-single-header .cod-header_top-nav nav > ul > li[role='menuitem']");

        topNavLinks.each(function() {

            //Clone nav item
			var $clone = $(this).clone();

            //Add clone nav item to ellipses drop down and hide it
            $clone.appendTo($ellipsisDropdownMenu).hide();

        });

        function updateEllipsisDropdown() {


            // Get width of total available space in top nav
            var navWidth = $('.cod-single-header .cod-header_top-nav nav').width();
            
            //Make sure all links are visible (quickly) to get full width of nav later
            $(".cod-single-header .cod-header_top-nav nav > ul > li[role='menuitem']").show();
            
            // Calculate the total width of the nav links.
            var navLinksWidth = 0;
            
            //Get all nav links that are not hidden
            var $navLinks = $(".cod-single-header .cod-header_top-nav nav > ul > li[role='menuitem']:not(:hidden)");
            var linkGap = 16;
            
            //Get the sum width of all links
            $navLinks.each(function(index) {
                
                //Get current width of nav links we've iterated already
                navLinksWidth += $(this).width() + linkGap;
                
                //var ellipsisWidth = $(".cod-header_desktop-nav_links .nav-ellipsis-dropdown").width(); // ~35px
                var ellipsisWidth = 42;
                
                //Check if the current nav links width is already greater than the total nav width to begin collapsing links
                if((navLinksWidth + ellipsisWidth) > navWidth) {
                    
                    //Add class collapsing to show the ellipsis drop down menu button
                    $(".cod-single-header .cod-header_top-nav").addClass("collapsing");
                    
                    //$("#cod-single-header .cod-header_sso").hide();
                    
                    //Get index of top nav item that begins to overflow the width of nav bar
                    var curIndex = index;
                    
                    //Get all the links that will need to be hidden
                    var $linksToHide = $navLinks.filter(":gt(" + (curIndex - 1) + ')');
                    
                    //Hide the rest of the links that we haven't iterated over yet
                    $linksToHide.hide();
                    
                    //Hide all links in ellipsis drop down menu at first
                    $ellipsisDropdownMenu.find("li").hide();
                    
                    $linksToHide.each(function() {
                        
                        var linkIdx = $(this).data("index");
                        
                        //Show the correct nav item in drop down menu
                        $ellipsisDropdownMenu.find("li[data-index='" + linkIdx + "']").show();
                        
                    });
                    
                    return false;
                    
                }
                
                else {
                    //Remove class collapsing to hide the ellipsis drop down menu button
                    $(".cod-single-header .cod-header_top-nav").removeClass("collapsing");
                }

            });

        }

 		// Add a listener to the window resize event to update the ellipsis dropdown.
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                updateEllipsisDropdown();
            }, 200); // Adjust the debounce time as needed
        });
        
        // Update the ellipsis dropdown on initial load.
        updateEllipsisDropdown();
    };

    var initEllipsis = function() {

        //Hover over ellipsis button
        $('#cod-single-header .cod-header_top-nav').on('mouseenter', '.nav-ellipsis-dropdown-toggle', function() {
              closeMobileMenu();
        });

        //Ellipsis menu link dropdown 
        $(".cod-single-header .nav-ellipsis-dropdown-menu li.dd > a").on("click", function(e) {

            e.preventDefault();

            if($(this).parent().attr("aria-expanded") != "true") {
				$(this).parent().attr("aria-expanded", "true");
            } 
            else {
				$(this).parent().attr("aria-expanded", "false");
            }

        });
    };

    var initMenuItemExpand = function() {

        var curUrl = window.location.href;
        var curUrlPathName = window.location.pathname;

        //If we are not on the hub page or the blog site
        if(curUrlPathName != "/" && curUrl.indexOf("/hub") < 0 &&
           curUrl.indexOf("/blog") < 0 && 
           curUrl.indexOf("/guides") < 0 && 
           curUrl.indexOf("/patchnotes") < 0 && 
           curUrl.indexOf("/store") < 0) {

            //Add aria-expanded to the games menu in the mobile drop down so that it is expanded by default
			$("#cod-single-header .cod-header_mobile-dropdown .cod-header_mobile-primary-menu > ul > li[data-index='0']").attr("aria-expanded", "true");

        }

        if(curUrl.indexOf("/blog") > 0 ||
           curUrl.indexOf("/guides") > 0 || 
           curUrl.indexOf("/patchnotes") > 0) {

			//Add aria-expanded to the news menu in the mobile drop down so that it is expanded by default
			$("#cod-single-header .cod-header_mobile-dropdown .cod-header_mobile-primary-menu > ul > li[data-index='1']").attr("aria-expanded", "true");


        }
    };

    var initResize = function() {

        $(window).on("resize", function() {

            if($("#cod-single-header .cod-header_search").attr("aria-expanded") == "true") {
				closeSearch();
            }

        });

    };

    $(init);

})();

(function() {

    var init = function() {

        $(window).on("load", initNavAnalytics);

    };

    var initNavAnalytics = function() {

		// if(!dataLayer && !digitalData) return;

        //Main Nav and SSO Links
        var $topNavLink = $(".cod-header_top-nav nav > ul > li > a, .cod-header_sso a");

        $topNavLink.on("click", function(event) {

			if(!dataLayer && !digitalData) return;

            dataLayer.push({
                action: "main nav",
                category: "navigation",
                event: "event",
                label: $(this).data("entext") || $(this).text() //inner text of link

            });

        });

        //Sub Nav
        var $subNavLink = $(".cod-header_top-nav > div > nav > ul > li > ul > li > a, .cod-header_mobile-dropdown a, .nav-ellipsis-dropdown-menu a");

        $subNavLink.on("click", function() {

			if(!dataLayer && !digitalData) return;

            var label;

            if($(this).closest("li.dd").length > 0) {
				label = $(this).closest("li.dd").find("> a").data("entext") + ": " + $(this).data("entext");
            }
            else {
				label = $(this).data("entext");
            }

            dataLayer.push({
                action: "sub nav",
                category: "navigation",
                event: "event",
                label: label

            });

        });

        //Purchase
		var $purchaseBtn = $(".cod-single-header .cod-header_cta a");

        $purchaseBtn.on("click", function() {

            if(!dataLayer && !digitalData) return;

			dataLayer.push({
                action: "main nav",
                category: "navigation",
                event: "event",
                label: $(this).data("entext"),
                destinationUrl: $(this).attr("href")

            });

        });

        //COD Logo
        var $logo = $(".cod-header_primary-logo a, .cod-header_secondary-logo a");

        $logo.on("click", function() {

            if(!dataLayer && !digitalData) return;

			dataLayer.push({
                action: "sub nav",
                category: "navigation",
                event: "event",
                label: $(this).find("img").attr("alt") || "Call Duty logo",
                destinationUrl: $(this).attr("href")

            });

        });

    };

	$(init);

})();
