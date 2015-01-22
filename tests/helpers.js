var require = $.fn.select2.amd.require;
var define = $.fn.select2.amd.define;

var Utils = require('select2/utils');

function MockContainer () {
  MockContainer.__super__.constructor.call(this);
}

Utils.Extend(MockContainer, Utils.Observable);

MockContainer.prototype.isOpen = function () {
  return this.isOpen;
};
