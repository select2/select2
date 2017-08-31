Select2 Documentation
=====================
[This repository][select2-docs-source] holds the latest documentation for
[Select2][select2].

What is this?
-------------
The documentation is automatically extracted from the `docs` directory at the
[Select2 source repository][select2-source]. This is done periodically by
the maintainers of Select2.

How can I fix an issue in these docs?
-------------------------------------
If you are reading this from the source repository, within the `docs` directory,
then you're already in the right place. You can fork the source repository,
commit your changes, and then make a pull request and it will be reviewed.

**If you are reading this from the
[documentation repository][select2-docs-source], you are in the wrong place.**
Pull requests made directly to the documentation repository will be ignored and
eventually closed, so don't do that.

How can I build these docs manually?
------------------------------------

### Requirements

##### Ruby and Jekyll

Jekyll is a static site builder written in Ruby.  You will need **the latest version** of [Jekyll][jekyll] installed to build the Select2 documentation.

First, [make sure that you have a Ruby environment set up][jekyll-quickstart].  Then, to install Jekyll:

`gem install jekyll bundler`

To upgrade Jekyll:

`gem update jekyll`

##### npm and Grunt

Select2 uses [Grunt][grunt], which is an npm package, as a task runner. To run the build task, you will need to first [install the latest version of npm and Node.js][nodejs] as well as the [Grunt CLI][grunt-cli].

### Building the docs with Grunt

This assumes that you have already cloned the Select2 repo to your local development environment.  In the [main Select2 repository][select2-source], you will first need to install the npm dependencies locally:

```
npm install
```

Then, you can build and launch the documentation by running

```bash
grunt docs
```

This will start up the documentation on port 4000 ([http://localhost:4000](http://localhost:4000)). 

[jekyll]: http://jekyllrb.com/
[jekyll-quickstart]: https://jekyllrb.com/docs/quickstart/
[grunt]: https://gruntjs.com
[grunt-cli]: https://gruntjs.com/getting-started
[nodejs]: https://nodejs.org/en/download/
[select2]: https://select2.github.io
[select2-docs-source]: https://github.com/select2/select2.github.io
[select2-source]: https://github.com/select2/select2
