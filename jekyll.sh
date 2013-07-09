#!/bin/bash

rm -rf _site
jekyll serve --watch --baseurl '/select2' --safe
