// Game Modes animations
document.addEventListener('DOMContentLoaded', () => {
    //console.log("Init Game Modes");
    const images = document.querySelectorAll('.atvi-card-image');
    const headingStripe = document.querySelector('.section-title h2');
    const bottomStripe = document.querySelector('.zombies .atvi-card-inner-container .atvi-card-content-container .atvi-card-content .atvi-card-text');

    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: '0px',
        threshold: 0.75 // Trigger when 75% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once the animation runs
            }
        });
    }, observerOptions);

    images.forEach((image) => {
        observer.observe(image);
    });

    if (headingStripe) {
        observer.observe(headingStripe);
    }

    if (bottomStripe) {
        observer.observe(bottomStripe);
    }
});


(function() {

    let init = function() {

        let $video = $("#hero .background-video-container video");
        let $playBtn = $("#hero .background-video-container .custom-controls #play-btn");
        let $pauseBtn = $("#hero .background-video-container .custom-controls #pause-btn");

        $playBtn.on("click", (event) => {
    		$video.trigger('play');
			$playBtn.hide();
        	$pauseBtn.show();
        });

        $pauseBtn.on("click", (event) => {
    		$video.trigger('pause');
			$pauseBtn.hide();
        	$playBtn.show();
        });

    };

    
    $(init);

})();

(function() {

    let init = function() {
        /*
		<div class="info-wcmmode" data-wcm-mode="${wcmmode.toString}"></div>

        */

		//var isEditor = window.Granite && window.Granite.author ? true : false;
        //console.log(isEditor);
        /*
        const wcmmode = $("html[data-wcm-mode]").data('wcmMode');

        // Don't run the rest of the code if in edit mode
        if(wcmmode == 'EDIT') {
            console.log('EDIT mode - stop running js');
            //return;
        }

        const html = $("html");
        console.log('html', html);
        const inEditMode = html.hasClass("aem-AuthorLayer-Edit");

        console.log('inEditMode: ', inEditMode);
        if(inEditMode) {
            console.log( 'aem-AuthorLayer-Edit');
        }

        var test = $(".aem-AuthorLayer-Edit");
        */
        initParallax();
    };

    let initParallax = function() {

        window.addEventListener('scroll', function() {
            var scrollPosition = window.pageYOffset;
            //var background = document.getElementById('hero-video');
            var background = document.querySelector('#hero-video video');
            var backgroundOverlay = document.querySelector('#hero-video .video-bg-overlay');

            // Adjust the speed of the background scroll here
            var parallaxSpeed = .5;

            background.style.transform = 'translateY(' + (scrollPosition * parallaxSpeed) + 'px)';
            backgroundOverlay.style.transform = 'translateY(' + (scrollPosition * parallaxSpeed) + 'px)';

        });

    };

    
    $(init);

})();
