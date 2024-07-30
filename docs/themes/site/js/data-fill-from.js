$(document).ready(function() {
  $("[data-fill-from]").each(function () {
    var $this = $(this);

    var codeContainer = $this.data("fill-from");
    var $container = $(codeContainer);

    var code = ($container.html() || '').trim();

    $this.text(code);
    $this.addClass("prettyprint");
  });
});
