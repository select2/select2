# v1.4.7
## 05/16/2017

1. [](#improved)
    * Added check for Exif module if this feature is enabled

# v1.4.6
## 02/17/2017

1. [](#improved)
    * Return 500 error code if there is a problem instead of 200 [https://github.com/getgrav/grav/issues/1291](https://github.com/getgrav/grav/issues/1291)

# v1.4.5
## 09/14/2016

1. [](#bugfix)
    * Show the correct status for the Zip extension check

# v1.4.4
## 09/08/2016

1. [](#new)
    * Added check for new root folder `tmp` and try to create if missing
1. [](#bugfix)
    * Fixed Whoops error if `backup` folder doesn't exist and cannot be created

# v1.4.3
## 05/27/2016

1. [](#new)
    * Reverted compression checks

# v1.4.2
## 05/23/2016

1. [](#new)
    * Check for compression issues

# v1.4.1
## 05/03/2016

1. [](#new)
    * Added a check for XML support in PHP
1. [](#improved)
    * Use common language strings in blueprints

# v1.4.0
## 01/06/2016

1. [](#improved)
    * Avoid generating errors on .DS_Store files added to the bin/ folder by OSX
    * Removed executable checks for bin/* commands. Going to document instead.

# v1.3.3
## 12/09/2015

1. [](#new)
    * Set minimum PHP requirements to 5.5.9
1. [](#improved)
    * Ensure problems plugin runs before admin

# v1.3.2
## 12/09/2015

1. [](#improved)
    * Skip windows platforms for executable permissions check
    * Removed mod_headers from required Apache modules check

# v1.3.1
## 12/07/2015

1. [](#improved)
    * Added executable check on `/bin/` files

# v1.3.0
## 12/07/2015

1. [](#improved)
    * Added check for PHP `OpenSSL`, `Mbstring` and `Curl` are installed
    * Added check to ensure `mod_rewrite` and `mod_headers` are installed if running Apache

# v1.2.0
## 08/25/2015

1. [](#improved)
    * Added blueprints for Grav Admin plugin

# v1.1.6
## 06/16/2015

2. [](#new)
    * Try to create missing `backup` folder if it is missing

# v1.1.5
## 05/09/2015

2. [](#new)
    * Added check for `backup` folder for Grav > 0.9.27

# v1.1.4
## 04/26/2015

2. [](#new)
    * Changelog started

