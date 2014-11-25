define([

], function () {
  function AttachContainer (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  AttachContainer.prototype.position =
    function (decorated, $container, $dropdown) {
    var $dropdownContainer = $container.find('.dropdown-wrapper');
    $dropdownContainer.append($dropdown);
  };

  return AttachContainer;
});
