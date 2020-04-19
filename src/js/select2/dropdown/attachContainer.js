define([

], function () {
  function AttachContainer (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  AttachContainer.prototype.position =
    function (decorated, $dropdown, $container) {
    var $dropdownContainer = $container.find('.dropdown-wrapper');
    $dropdownContainer.append($dropdown);

    $dropdown[0].classList.add('select2-dropdown--below');
    $container[0].classList.add('select2-container--below');
  };

  return AttachContainer;
});
