/**
 * Select2 Serbian translation.
 *
 * Author: Vojislav Zelic <vodzo@zelic.info>
 */
(function ($) {
    "use strict";

    $.fn.select2.locales['sr'] = {
        formatMatches: function (matches) { if (matches === 1) { return "Jedan rezultat pronađen, pritisni enter da ga izavereš."; } return matches + " " + declination(matches, 'rezultata pronađeno', 'rezultata pronađeno', 'rezultat pronađen') + ", koristi strelice gore/dole za navigaciju."; },
        formatNoMatches: function () { return "Nema rezultata"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Upiši " + n + " ili više " + declination(n, 'karaktera', 'karaktera', 'karakter'); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Obriši " + n + " " + declination(n, 'karaktera', 'karaktera', 'karakter'); },
        formatSelectionTooBig: function (limit) { return "Možeš izabrati samo " + limit + " " + declination(limit, 'opcije' , 'opcije', 'opciju'); },
        formatLoadMore: function (pageNumber) { return "Učitavam još rezultata…"; },
        formatSearching: function () { return "Pretraživanje u toku…"; }
    };

    $.extend($.fn.select2.defaults, $.fn.select2.locales['sr']);
	
	var _declination = function(num, string1, string2, string3) {
		var num = typeof(num) === 'number' ? num.toString() : num;
		var lastnum = parseInt(num.substring(num.length-1, num.length));
		var lasttwonum = parseInt(num.substring(num.length-2, num.length));
		var link_title = "";

		if(lasttwonum <=20 && lasttwonum >=11)
			{
			link_title = string1;
			}
		else if(lastnum === 1)
			{
			if(lasttwonum === 11) link_title = string1;
			else link_title = string3;
			}
		else if(lastnum === 2 || lastnum === 3 || lastnum === 4)
			{
			link_title = string2;
			}
		else link_title = string1;

		return link_title;
	}
})(jQuery);
