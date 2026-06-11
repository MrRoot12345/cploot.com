

var ATVI = ATVI || {};

(function($, ATVI) {

    var init = function() {

        //Add CA privacy links
        var $privacyLinksContainer = $(".cod-global-footer .legal-links ul");
    
        ATVI.utils.addPrivacyLinks($privacyLinksContainer);

        //Add JA legal terms link
        if(ATVI.pageLocale == 'ja') {

			var $valuesLegalLink = $(".legal-links li a[href='https://www.callofduty.com/ja/values']").closest("li");

            $("<li><a href='https://www.callofduty.com/ja/legal-points-terms'>æ³•çš„è¡¨è¨˜</a></li>").insertAfter($valuesLegalLink);

        }

    };

    $(init);

})(jQuery, ATVI);