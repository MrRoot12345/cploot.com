var COD = COD || {};

(function($) {

    var init = function() {

		toggleMenu();
        useLongRootPath();

        var url = window.location.href;
        if(url.indexOf("my.callofduty.com") > 0) {
            myCod();
        }
        if(window.location.pathname.startsWith('/content/atvi')) {
			useLongRootPath();
        }

        initAnalytics();
    };

    var toggleMenu = function() {

        var $flagBtn = $(".atvi-locale-selector .cur-locale-selector-btn button ");

        $flagBtn.click(function() {

            var $localePanel = $(this).closest(".atvi-locale-selector").find(".locale-panel");
            $localePanel.toggle();

            if($localePanel.is(":visible")) {
				$(this).attr("aria-expanded", "true");
            }

            else {
        		$(this).attr("aria-expanded", "false");
            }
        });

        var $closeBtn = $(".atvi-locale-selector .close-btn button");

        $closeBtn.click(function() {

			$(".atvi-locale-selector .locale-panel").hide();
            $(this).attr("aria-expanded", "false");

        });

    };

    var getNewLangUrl = function(code) {

        var newUrl;
		var curUrl = window.location.href; //https://my.callofduty.com/uk/en/player/store
        var curLocale = ATVI.pageLocale;

        if(curLocale == "es_MX" || curLocale == "es_CL" || curLocale == "en_GB" || curLocale == "en_AR" || curLocale == "en_AU" || curLocale == "en_CA" || curLocale == "en_NZ" || curLocale == "fr_CA" || curLocale == "fr_BE" || curLocale == "pt_BR" || curLocale == "en_MY") {

            var codeUrl;
            if(code == "es_mx") codeUrl = "/mx/es";
            else if(code == "es_cl") codeUrl = "/cl/es";
            else if(code == "en_gb") codeUrl = "/uk/en";
            else if(code == "en_au") codeUrl = "/au/en";
            else if(code == "en_ca") codeUrl = "/ca/en";
            else if(code == "fr_ca") codeUrl = "/ca/fr";
            else if(code == "pt_br") codeUrl = "/br/pt";
            else if(code == "fr_be") codeUrl = "/be/fr";
            else if(code == "en_nz") codeUrl = "/nz/en";
            else if(code == "en_ar") codeUrl = "/ar/en";
            else if(code == "en_my") codeUrl = "/my/en";
            else codeUrl = "/" + code;
            if(code == "en") codeUrl = "";

			var splitUrl = curUrl.split("/").splice(5).join("/"); // player/store
            newUrl = "https://my.callofduty.com" + codeUrl + "/" + splitUrl;

        }

        else {
			var splitUrl = curUrl.split("/").splice(4).join("/");
            var codeUrl;
            if(code == "es_mx") codeUrl = "/mx/es";
            else if(code == "es_cl") codeUrl = "/cl/es";
            else if(code == "en_gb") codeUrl = "/uk/en";
            else if(code == "en_au") codeUrl = "/au/en";
            else if(code == "en_ca") codeUrl = "/ca/en";
            else if(code == "fr_ca") codeUrl = "/ca/fr";
            else if(code == "pt_br") codeUrl = "/br/pt";
            else if(code == "fr_be") codeUrl = "/be/fr";
            else if(code == "en_nz") codeUrl = "/nz/en";
            else if(code == "en_ar") codeUrl = "/ar/en";
            else if(code == "en_my") codeUrl = "/my/en";
            else codeUrl = "/" + code;
            if(code == "en") codeUrl = "";

            newUrl = "https://my.callofduty.com" + codeUrl + "/" + splitUrl;
        }

        return newUrl;

    };

    var myCod = function() { 

        $(".locale-panel ul li").each(function() {
            var lang = $(this).data("lang"); // en, es, es_mx, fr, fr_ca, en_gb
            var newUrl = getNewLangUrl(lang);
            $(this).find("a").attr("href", newUrl);
    
        });
    };


    /*	Modifies locale links to handle if rootpath is used on locale selector
     *  When on author/preview/production using path url (/content/atvi/callofduty/hub/web/en/home.html),
     *  update root paths ('/', '/fr', etc) to match the long path 
     */
    var useLongRootPath = function() {

        const urlPath = window.location.pathname;
        const curLoc = document.querySelector('.atvi-locale-selector').dataset.selectedlocale; // en, es, es_mx, fr, fr_ca, en_gb

		// check if rootpath is being used and ensure the path is more than just a single path such as /home or de/home
        if(document.querySelector('.atvi-locale-selector .locale-panel ul li.active a').pathname != urlPath && urlPath.split('/').filter(item => item).length > 2) {
            // modify locale paths to the long urls
            document.querySelectorAll(".locale-panel ul li").forEach((node) => {
                const lang = node.dataset.lang; // en, es, es_mx, fr, fr_ca, en_gb
                const newUrl = urlPath.replace(`/${curLoc}/`,`/${lang}/`);
                node.firstElementChild.href = newUrl;
            });
        }
    };

    var initAnalytics = function() {

        if(!digitalData || !dataLayer) return;

		var $regionLinks = $(".atvi-locale-selector a");

        $regionLinks.on("click", function() {


            dataLayer.push({
                action: 'locale selector' + ":" + $(this).find(".region").text(),
                event: 'interaction',
                category: 'interaction:' + digitalData.page.pageInfo.site + ":" + digitalData.page.pageInfo.siteSection + ":" + digitalData.page.pageInfo.siteSubsection,
                label: $(this).attr("href")
            });


        });

    };

    $(init);

    COD.updateLocales = myCod;

})(jQuery);