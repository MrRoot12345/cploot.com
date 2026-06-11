(function($) {

    window.ATVIVideoEls = window.ATVIVideoEls || [];
    var ytArr = []; //holds ATVI video elements

    let init = function() {

		initATVICtaModal();
        initATVICtaScroll();

    };

    let initATVICtaScroll = function() {

		//let scrollBtns = $(".atvi-cta-container button[data-scroll-target]:not([data-scroll-target='#']");
		let scrollBtns = $(".atvi-cta-container button[data-scroll-target]");

        scrollBtns.each(function() {

            var btn = $(this);

            $(this).on("click", function() {

				//Get target element ID from data-scroll-target
                //var target = $(btn.data("scroll-target"));
				var target = $('#' + btn.data("scroll-target"));

                //Get displacement value
                var displacement = parseInt(btn.data("scroll-displacement"));

                //Get fixed header height
				var headerHeight = $("header").outerHeight();

                /*$('html,body').animate({
                    scrollTop: target.offset().top - headerHeight - 20
                }, 100);*/

                $('html,body').animate({
                    scrollTop: target.offset().top - headerHeight - 20
                }, 100, function() {

                    //After scrolling, attemp to focus on element
                    target.focus();

                    //If the target was focused
                    if(target.is(":focus")) {
                        return false;
                    } else {
                        target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
                        target.focus(); // Set focus again
                        $(window).scrollTop(target.offset().top - headerHeight - 20); //scroll back up to proper position
                    }

                });

            });

        });

    };

    let initATVICtaModal = function() {


        //Select all buttons that have modal enabled
		let modalBtns = $(".atvi-cta-container button[data-modal='true']");

        //For each button that have modal enabled
        modalBtns.each(function() {

            $(this).on("click", function() {

                //Run openModal passing in the clicked on button element
				openModal($(this));

            });

        });

        //Close modal on close button or background
        let overlays     = $(".atvi-cta-container .modal-overlay");
        let modalContent = overlays.find(".modal-content");
        let mediaContent = overlays.find(".media-content");
        let closeBtns    = overlays.find(".modal-close");

        //Close modal on close button or background
        overlays.add(closeBtns).click(function(e) {

            var ytid = $(this).find(".atvi-video-component").data("youtube-id");
            if (ytid) { pauseVideo($(this), ytid); } //pause all videos ... just in case one is in the middle of playing
            overlays.fadeOut(function() { //overlay fades out

                //Update aria expanded 
                var modalId = $(this).closest(".modal-overlay").attr("id");
                $("button[aria-controls='" + modalId + "']").attr("aria-expanded", "false");

                //remove image/video from modal 
				mediaContent.empty(); 
            });

        });

        //if you click inside modal, nothing happens
		modalContent.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

    };

    let openModal = function(el) {

        //Update aria expanded 
        el.attr("aria-expanded", "true");

        //Select the cta container's parent
		let parent  = el.closest(".atvi-cta-container");

        //From the parent container, select the modal overlay element
        let overlay = parent.find(".modal-overlay");

        //Run buildModal and pass 
        buildModal(el);

        //Fade in overlay
        overlay.fadeIn();

    };

    let initAutoPlay = function(vidEl) {

        var ag   = vidEl.closest(".atvi-cta-container").data("agegate"); //check if agegate is enabled on entire CTA component: true or false

        let agCookie = ATVI.utils.getCookie("agegate"); //check if agegate cookie exists
        var c = ATVI.components.video.getContext(vidEl);
        
        if((ag == false || !ag) || agCookie) { //if age gate not enabled or age gate cookie exists (meaning age verification success)
            //autplay video
            
            c.play();
        }
        else if(ag && !agCookie) { //if age gate is enabled and age gate cookie doesn't exist (meaning age verification hasn't happened)
            //agegate shows up
            let agSubmit = vidEl.closest(".atvi-cta-container").find(".submit-wrapper a"); //age gate submit button
            
            agSubmit.on("click", function() {
                if(ATVI.utils.getCookie("agegate").length > 0) { //check if age gate cookie was created to signify age verification
                    c.play(); // play video
                }
            });
        }

    };

    let buildModal = function(el) {

        let type = el.data("type"); //get "media" data
        var ytid = el.data("ytid");
        var img  = el.data("img");
        var videoTitle = el.data("youtube-title");
        var autoplay = el.data("autoplay");
        var agegate  = el.data("agegate");
		var noCookies = el.data("nocookies");

        //define thumb data values
		let modalItem = $("<div>", {"class": "modal-item", "data-type" : type}); //create new "div" tag with class name "modal-item and data-type = the media type (image/video), and data-id = id
        if(type == "image") {
            var img = $('<img>', {'src': img, 'alt': ''}); //create image element with full source path and alt text
            modalItem.append(img); //add image to created div element
        }
        else {
            var vid = buildYtVideo(ytid, "atvi-cta-modal-video-item", autoplay, agegate, noCookies, videoTitle); //build youtube video
            modalItem.append(vid); //add video to created div element
        }

        el.closest(".atvi-cta-container").find(".modal-overlay .media-content").append(modalItem);

    };

    var buildYtVideo = function(ytid, vidId, autoplay, agegate, noCookies, videoTitle) {

        var youtubeId = ytid,
            elId = vidId,
            $wrapperEl = $('<div>', {'id': elId, 'class': 'atvi-video-component', 'data-youtube-id': youtubeId, 'data-video-title': videoTitle}),
            $inner = $('<div>', { 'class': 'player atvi-instrument atvi-instrument-video-player'}),
            $embedEl = $('<div>', {'id': elId + '-embed'}),
            $el = $wrapperEl.append($inner.append($embedEl)),
            ageGatePassed = ATVI.utils.getCookie("agegate") ? true : false,
            autoPlay = ((!agegate || ageGatePassed) && autoplay) ? 1 : 0,
            configObj = { youtubeId: youtubeId, start: 0, customControls: false, autoPlay: autoPlay, noCookies: noCookies };
        
        window.ATVIVideoEls.push({
            $el: $el,
            config: configObj
        });
        
        ytArr.push($el);
        
        ATVI.library.withDependency('atvi-video', false, function() {

            if(!ATVI.components.video.YTScriptLoaded) {
                ATVI.components.video.initYtAPI(function() {
                    ATVI.components.video.generatePlayer($el, configObj);
                    if (!$el.find('.' + $el.attr('id') + '-embed').children().length) {
                        setTimeout(function() {
                            ATVI.components.video.purgeContext($el);
                            ATVI.components.video.generatePlayer($el, configObj);
                            setTimeout(function() { 
                                //initAutoPlay($el);
                            }, 1000);
                        }, 500);
                    }
            	});
            }
            else {
				ATVI.components.video.generatePlayer($el, configObj);
                if (!$el.find('.' + $el.attr('id') + '-embed').children().length) {
                    setTimeout(function() {
                        ATVI.components.video.purgeContext($el);
                        ATVI.components.video.generatePlayer($el, configObj);
                        setTimeout(function() { 
                            //initAutoPlay($el);
                        }, 1000);
                    }, 500);
                }
            }

            $("body").on("youtubeApiScriptLoaded", function (e, d) { 
                console.log("API IS READY!!!!!!!!!!!!!!!!!!!!!");
            });

            /*if (!ATVI.components.video.YTScriptLoaded) ATVI.components.video.initYtAPI();
            else {
                ATVI.components.video.generatePlayer($el, configObj);
                if (!$el.find('.' + $el.attr('id') + '-embed').children().length) {
                    setTimeout(function() {
                        ATVI.components.video.purgeContext($el);
                        ATVI.components.video.generatePlayer($el, configObj);
                        setTimeout(function() {
                            initAutoPlay($el);
                        }, 1000);
                    }, 500);
                }
            }*/
        });
        
        return $el;
    };

    var pauseVideo = function(el, ytid) {
		var i;
        var vid = el.find(".atvi-video-component");
        var c = ATVI.components.video.getContext(vid);

        if(c && c.pause) {

            c.pause();

			/*ATVI.components.video.analytics_handleEnd({
                context: c,
                youtubeId: ytid
            });
            c.stop();*/

        }

        /*for (i = 0; i < ytArr.length; i++) {
			var c = ATVI.components.video.getContext(ytArr[i]);
            if (c && c.pause && c.opts.youtubeId = ytid) {
                ATVI.components.video.analytics_handlePause({
                    context: c,
                    youtubeId: ytArr[i][0].dataset['youtubeId']
                });
                c.pause();
            }
        }*/
    };

	$(init);

})(jQuery);