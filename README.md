Select2
=======
![Build Status][github-actions-image]
[![Financial Contributors on Open Collective](https://opencollective.com/select2/all/badge.svg?label=financial+contributors)](https://opencollective.com/select2) [![cdnjs](https://img.shields.io/cdnjs/v/select2.svg)][cdnjs]
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/select2/badge)][jsdelivr]

Select2 is a jQuery-based replacement for select boxes. It supports searching,
remote data sets, and pagination of results.

To get started, checkout examples and documentation at
https://select2.org/

Use cases
---------
* Enhancing native selects with search.
* Enhancing native selects with a better multi-select interface.
* Loading data from JavaScript: easily load items via AJAX and have them
  searchable.
* Nesting optgroups: native selects only support one level of nesting. Select2
  does not have this restriction.
* Tagging: ability to add new items on the fly.
* Working with large, remote datasets: ability to partially load a dataset based
  on the search term.
* Paging of large datasets: easy support for loading more pages when the results
  are scrolled to the end.
* Templating: support for custom rendering of results and selections.

Browser compatibility
---------------------
* IE 8+
* Chrome 8+
* Firefox 10+
* Safari 3+
* Opera 10.6+

Usage
-----
You can source Select2 directly from a CDN like [jsDelivr][jsdelivr] or
[cdnjs][cdnjs], [download it from this GitHub repo][releases], or use one of
the integrations below.

Integrations
------------
Third party developers have created plugins for platforms which allow Select2 to be integrated more natively and quickly. For many platforms, additional plugins are not required because Select2 acts as a standard `<select>` box.

Plugins

* [Django]
  - [django-autocomplete-light]
  - [django-easy-select2]
  - [django-select2]
* [Drupal] - [drupal-select2]
* [Meteor] - [meteor-select2]
* [Ruby on Rails][ruby-on-rails] - [select2-rails]
* [Wicket] - [wicketstuff-select2]
* [Yii 2][yii2] - [yii2-widget-select2]
* [Angularjs][angularjs] - [mdr-angular-select2]

Themes

- [Bootstrap 3][bootstrap3] - [select2-bootstrap-theme]
- [Bootstrap 4][bootstrap4] - [select2-bootstrap4-theme]
- [Flat UI][flat-ui] - [select2-flat-theme]
- [Metro UI][metro-ui] - [select2-metro]

Missing an integration? Modify this `README` and make a pull request back here to Select2 on GitHub.

Internationalization (i18n)
---------------------------
Select2 supports multiple languages by simply including the right language JS
file (`dist/js/i18n/it.js`, `dist/js/i18n/nl.js`, etc.) after
`dist/js/select2.js`.

Missing a language? Just copy `src/js/select2/i18n/en.js`, translate it, and
make a pull request back to Select2 here on GitHub.

Documentation
-------------
The documentation for Select2 is available
[online at the documentation website][documentation] and is located within the
[`docs` directory of this repository][documentation-directory].

Community
---------
You can find out about the different ways to get in touch with the Select2
community at the [Select2 community page][community].

Copyright and license
---------------------
The license is available within the repository in the [LICENSE][license] file.

[cdnjs]: http://www.cdnjs.com/libraries/select2
[community]: https://select2.org/getting-help
[documentation]: https://select2.org
[documentation-directory]: https://github.com/select2/select2/tree/develop/docs
[freenode]: https://freenode.net/
[github-actions-image]: https://github.com/select2/select2/workflows/CI/badge.svg
[jsdelivr]: https://www.jsdelivr.com/package/npm/select2
[license]: LICENSE.md
[releases]: https://github.com/select2/select2/releases

[angularjs]: https://angularjs.org/
[bootstrap3]: https://getbootstrap.com/
[bootstrap4]: https://getbootstrap.com/
[django]: https://www.djangoproject.com/
[django-autocomplete-light]: https://github.com/yourlabs/django-autocomplete-light
[django-easy-select2]: https://github.com/asyncee/django-easy-select2
[django-select2]: https://github.com/applegrew/django-select2
[drupal]: https://www.drupal.org/
[drupal-select2]: https://www.drupal.org/project/select2
[flat-ui]: http://designmodo.github.io/Flat-UI/
[mdr-angular-select2]: https://github.com/modulr/mdr-angular-select2
[meteor]: https://www.meteor.com/
[meteor-select2]: https://github.com/nate-strauser/meteor-select2
[metro-ui]: http://metroui.org.ua/
[select2-metro]: http://metroui.org.ua/select2.html
[ruby-on-rails]: http://rubyonrails.org/
[select2-bootstrap-theme]: https://github.com/select2/select2-bootstrap-theme
[select2-bootstrap4-theme]: https://github.com/ttskch/select2-bootstrap4-theme
[select2-flat-theme]: https://github.com/techhysahil/select2-Flat_Theme
[select2-rails]: https://github.com/argerim/select2-rails
[vue.js]: http://vuejs.org/
[select2-vue]: http://vuejs.org/examples/select2.html
[wicket]: https://wicket.apache.org/
[wicketstuff-select2]: https://github.com/wicketstuff/core/tree/master/select2-parent
[yii2]: http://www.yiiframework.com/
[yii2-widget-select2]: https://github.com/kartik-v/yii2-widget-select2

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](.github/CONTRIBUTING.md)].
<a href="https://github.com/select2/select2/graphs/contributors"><img src="https://opencollective.com/select2/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/select2/contribute)]

#### Individuals

<a href="https://opencollective.com/select2"><img src="https://opencollective.com/select2/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/select2/contribute)]

<a href="https://opencollective.com/select2/organization/0/website"><img src="https://opencollective.com/select2/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/1/website"><img src="https://opencollective.com/select2/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/2/website"><img src="https://opencollective.com/select2/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/3/website"><img src="https://opencollective.com/select2/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/4/website"><img src="https://opencollective.com/select2/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/5/website"><img src="https://opencollective.com/select2/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/6/website"><img src="https://opencollective.com/select2/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/7/website"><img src="https://opencollective.com/select2/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/8/website"><img src="https://opencollective.com/select2/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/select2/organization/9/website"><img src="https://opencollective.com/select2/organization/9/avatar.svg"></a>
