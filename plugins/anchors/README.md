# Grav Anchors Plugin


`anchors` is a [Grav](http://github.com/getgrav/grav) plugin that provides automatic header anchors via the [anchorjs](http://bryanbraun.github.io/anchorjs) jQuery plugin.

# Installation

## GPM Installation (Preferred)

The simplest way to install this plugin is via the [Grav Package Manager (GPM)](http://learn.getgrav.org/advanced/grav-gpm).  From the root of your Grav install type:

    bin/gpm install anchors

## Manual Installation

If for some reason you can't use GPM you can manually install this plugin. Download the zip version of this repository and unzip it under `/your/site/grav/user/plugins`. Then, rename the folder to `anchors`.

You should now have all the plugin files under

	/your/site/grav/user/plugins/anchors

# Usage

To best understand how Anchors works, you should read through the original [project documentation](https://github.com/bryanbraun/anchorjs).

## Configuration:

Simply copy the `user/plugins/breadcrumbs/anchors.yaml` into `user/config/plugins/anchors.yaml` and make your modifications.

    enabled: true                 # enable or disable the plugin
    active: true                  # active by default, if false then you must activate per-page
    selectors: 'h1,h2,h3,h4'      # css elements to activate on.  Uses jQuery style selectors
    placement: right              # either "left" or "right"
    visible: hover                # Active on "hover" or "always" visible
    icon:                         # default link or a specific character like: #, ¶, ❡, and §.
    class:                        # adds the provided class to the anchor html
    truncate: 64                  # truncates the generated ID to the specified character length

You can override any default settings from the page headers:

eg:

    ---
    title: Sample Code With Custom Theme
    anchors:
        active: true
        selectors: .blog h1, .blog h2
    ---

    # Header

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas accumsan porta diam,
    nec sagittis odio euismod nec. Etiam eu rutrum eros.

    ## Sub Header

    Proin commodo lobortis elementum.
    Integer vel ultrices massa, nec ornare urna. Phasellus tincidunt rutrum dolor, vestibulum
    faucibus ligula laoreet id. Donec hendrerit arcu vitae lacus mattis facilisis. Praesent
    tortor nibh, pulvinar nec orci ac, rhoncus pharetra nunc.


You can also disable anchors for a particular page if causes issues:

    ---
    title: Sample Code with Highlight disabled
    anchors:
        active: false
    ---

    # Header

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas accumsan porta diam,
    nec sagittis odio euismod nec. Etiam eu rutrum eros.

    ## Sub Header

    Proin commodo lobortis elementum.
    Integer vel ultrices massa, nec ornare urna. Phasellus tincidunt rutrum dolor, vestibulum
    faucibus ligula laoreet id. Donec hendrerit arcu vitae lacus mattis facilisis. Praesent
    tortor nibh, pulvinar nec orci ac, rhoncus pharetra nunc.


> Note: If you want to see this plugin in action, have a look at [Grav Learn Site](http://learn.getgrav.org)
