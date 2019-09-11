# Grav Error Plugin

![GPM Installation](assets/readme_1.png)

`error` is a [Grav](http://github.com/getgrav/grav) Plugin and allows to redirect errors to nice output pages.

This plugin is required and you'll find it in any package distributed that contains Grav. If you decide to clone Grav from GitHub you will most likely want to install this.

# Installation

Installing the Error plugin can be done in one of two ways. Our GPM (Grav Package Manager) installation method enables you to quickly and easily install the plugin with a simple terminal command, while the manual method enables you to do so via a zip file.

## GPM Installation (Preferred)

The simplest way to install this plugin is via the [Grav Package Manager (GPM)](http://learn.getgrav.org/advanced/grav-gpm) through your system's Terminal (also called the command line).  From the root of your Grav install type:

    bin/gpm install error

This will install the Error plugin into your `/user/plugins` directory within Grav. Its files can be found under `/your/site/grav/user/plugins/error`.

## Manual Installation

To install this plugin, just download the zip version of this repository and unzip it under `/your/site/grav/user/plugins`. Then, rename the folder to `error`. You can find these files either on [GitHub](https://github.com/getgrav/grav-plugin-error) or via [GetGrav.org](http://getgrav.org/downloads/plugins#extras).

You should now have all the plugin files under

    /your/site/grav/user/plugins/error

>> NOTE: This plugin is a modular component for Grav which requires [Grav](http://github.com/getgrav/grav), the [Problems](https://github.com/getgrav/grav-plugin-problems) plugin, and a theme to be installed in order to operate.

# Usage

The `error` plugin doesn't require any configuration. The moment you install it, it is ready to use.

Something you might want to do is to override the look and feel of the error page, and with Grav it is super easy.

### Template

Copy the template file [error.html.twig](templates/error.html.twig) into the `templates` folder of your custom theme and that is it.

```
/your/site/grav/user/themes/custom-theme/templates/error.html.twig
```

You can now edit the override and tweak it however you prefer.

### Page

Copy the page file [error.md](pages/error.md) into the `pages` folder of your user directory and that is it.

```
/your/site/grav/user/pages/error/error.md
```

You can now edit the override and tweak it however you prefer.

# Custom error pages

The configuration allows to specify pages different than `/error` for specific error codes. By default, the `404` error leads to the `/error` page. If you change that, make sure the page you point to has a `error` template (which means, its markdown file is `error.md` or in the page frontmatter you specify `template: error`.

# CLI Usage
The `error` plugin comes with a CLI command that outputs the `grav.log` in a beautified way, with possibility of limiting the amount of errors displayed, as well as include the trace in the output.

### Commands

| `bin/plugin error log` |                                                                 |
|------------------------|-----------------------------------------------------------------|
| [ --limit N \| -l N ]  | The amount of errors to display. Default is 5                   |
| [ --trace \| -t ]      | When used, it will add the backtrace in the output of the error |


# Updating

As development for the Error plugin continues, new versions may become available that add additional features and functionality, improve compatibility with newer Grav releases, and generally provide a better user experience. Updating Error is easy, and can be done through Grav's GPM system, as well as manually.

## GPM Update (Preferred)

The simplest way to update this plugin is via the [Grav Package Manager (GPM)](http://learn.getgrav.org/advanced/grav-gpm). You can do this with this by navigating to the root directory of your Grav install using your system's Terminal (also called command line) and typing the following:

    bin/gpm update error

This command will check your Grav install to see if your Error plugin is due for an update. If a newer release is found, you will be asked whether or not you wish to update. To continue, type `y` and hit enter. The plugin will automatically update and clear Grav's cache.

## Manual Update

Manually updating Error is pretty simple. Here is what you will need to do to get this done:

* Delete the `your/site/user/plugins/error` directory.
* Downalod the new version of the Error plugin from either [GitHub](https://github.com/getgrav/grav-plugin-error) or [GetGrav.org](http://getgrav.org/downloads/plugins#extras).
* Unzip the zip file in `your/site/user/plugins` and rename the resulting folder to `error`.
* Clear the Grav cache. The simplest way to do this is by going to the root Grav directory in terminal and typing `bin/grav clear-cache`.

> Note: Any changes you have made to any of the files listed under this directory will also be removed and replaced by the new set. Any files located elsewhere (for example a YAML settings file placed in `user/config/plugins`) will remain intact.
