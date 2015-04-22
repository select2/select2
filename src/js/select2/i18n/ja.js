(function() {
    if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) var e = jQuery.fn.select2.amd;
    return e.define("select2/i18n/ja", [], function() {
        return {
            errorLoading: function() {
                return "結果は読み込めませんでした。"
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = t + "文字を削除してください。";
                return n
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = t + "文字以上を入力してください。";
                return n
            },
            loadingMore: function() {
                return "より多くの結果を読み込んでいます..."
            },
            maximumSelected: function(e) {
                var t = e.maximum + "個しか選択できません";
                return t
            },
            noResults: function() {
                return "結果が見つかりませんでした"
            },
            searching: function() {
                return "検索中…"
            }
        }
    }), {
        define: e.define,
        require: e.require
    }
})();
