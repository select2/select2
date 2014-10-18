define([

], function () {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
      '<span class="search">' +
        '<input type="search" name="search" tabindex="-1" role="textbox" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$search.on('keyup', function () {
      container.trigger('query', {
        term: $(this).val()
      });
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer.show();
        } else {
          self.$searchContainer.hide();
        }
      }
    });
  };

  Search.prototype.showSearch = function (params) {
    return true;
  };

  return Search;
});
