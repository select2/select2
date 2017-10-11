define([
  'jquery',
  '../utils'
], function ($, Utils) {
  function Tabs () { }

  Tabs.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var resultTabs = '';
    var allTabs = this.options.get('resultTabs');

    $.each(allTabs, function(k, tabData){
      var tab = '<a href="#" class="tab-link" data-id="' +
            tabData.id + '"><span class="tab-name">' +
            tabData.text + '</span><small class="tab-count">0</small></a>';
      resultTabs += tab;
    });

    var $tabs = $(
      '<span class="select2-tabs select2-tabs--dropdown tabs-count-' + allTabs.length + '">' +
        resultTabs +
      '</span>'
    );

    this.$tabsContainer = $tabs;

    $rendered.find('.select2-results').before($tabs);

    return $rendered;
  };

  Tabs.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$tabsContainer.find('a').on('click', function(evt) {
      var el = $(this);
      var id = el.data('id');

      self.selectTab(id);

      evt.preventDefault();
    });

    container.on('open', function () {
      var tabId = self.$tabsContainer.find('a:first-child').data('id');
      try {
        var val = self.$element.val();
        $.each(self.options.options.data, function(k, d) {
          if (d.id === val) {
            tabId = d.tabId;
            return false;
          } else if (d.children && d.children.length) {
            $.each(d.children, function(i, c) {
              if (c.id === val) {
                tabId = c.tabId;
                return false;
              }
            });
          }
        });
      } catch (e) {}
      self.selectTab(tabId);
    });

    container.on('close', function () {
      self.$tabsContainer.find('a').removeClass('tab-selected');
      self.selectedTab = null;
    });

    // intercept results events so we can first filter out the items for the correct tab
    container.on('tabresults:all', function(params) {
      self.tabResults = params;
      self.fillTab('results:all');
      self.updateCount();
    });

    container.on('tabresults:append', function(params) {
        self.tabResults.data = self.tabResults.data.concat(params.data);
        self.fillTab('results:append');
        self.updateCount();
    });

  };

  Tabs.prototype.selectTab = function (_, tabId) {
    this.selectedTab = tabId;
    this.$tabsContainer.find('a').removeClass('tab-selected');
    this.$tabsContainer.find('a[data-id="' + tabId + '"]').addClass('tab-selected');
    this.fillTab('results:all');
    this.$search.focus();
  };

  Tabs.prototype.fillTab = function (_, eventName) {

    if (!this.tabResults) {
      return;
    }

    var params = this.tabResults || {};
    var tabId = this.selectedTab;
    var results = [];
    var counts = {};

    // filter out the results for this specific tab
    $.each(params.data.results || [], function(k, res){
      if (res.tabId === tabId) {
        results.push(res);
      }
    });

    this.trigger(eventName, {
      data: {
        more: params.data.more,
        results: results
      },
      query: params.query
    });

  };

  Tabs.prototype.updateCount = function () {

    if (!this.tabResults) {
      return;
    }

    var counts = {};

    // filter out the results for this specific tab
    $.each(this.tabResults.data.results || [], function(k, res){
      if (typeof counts[res.tabId] === 'undefined') {
        counts[res.tabId] = 0;
      }
      if (!res.isSpecial) {
        counts[res.tabId]++;
      }
    });

    this.$tabsContainer.find('a').each(function(){
      var el = $(this);
      var id = el.data('id');

      el.find('small').text(counts[id] || 0);
    });

  };

  return Tabs;
});
