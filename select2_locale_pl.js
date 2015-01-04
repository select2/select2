/**
 * Select2 Polish translation.
 *
 * @author  Jan Kondratowicz <jan@kondratowicz.pl>
 * @author  Uriy Efremochkin <efremochkin@uriy.me>
 * @author  Michał Połtyn <mike@poltyn.com>
 * @author  Damian Zajkowski <damian.zajkowski@gmail.com>
 * @ author Krzysztof Maliszewski <k.a.maliszewski@gmail.com>
 */
(function($) {
    "use strict";

    $.fn.select2.locales['pl'] = {
        formatNoMatches: function() {
            return "Brak wyników";
        },
        formatInputTooShort: function(input, min) {
            return "Wpisz co najmniej" + character(min - input.length, ["znak","znaki","znaków"]);
        },
        formatInputTooLong: function(input, max) {
            return "Wpisana fraza jest za długa o" + character(input.length - max, ["znak","znaki","znaków"]);
        },
        formatSelectionTooBig: function(limit) {
            return "Możesz zaznaczyć najwyżej" + character(limit, ["element","elementy","elementów"]);
        },
        formatLoadMore: function(pageNumber) {
            return "Ładowanie wyników…";
        },
        formatSearching: function() {
            return "Szukanie…";
        }
    };

    $.extend($.fn.select2.defaults, $.fn.select2.locales['pl']);

    function character(n, words) {
		var index = 0;
        if(n == 1) index = 0;
		else{
			var modulo = n % 10;
			var modulo_2 = n % 100;
			if((modulo == 2 || modulo == 3 || modulo == 4) && modulo_2 != 12 && modulo_2 != 13 && modulo_2 != 14) index = 1;
			else index = 2;
		}
		
		var word = words[index];
		
		return " " + n + " " + word;
    }
})(jQuery);
