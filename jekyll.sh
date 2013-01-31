#!/bin/bash

rm -rf _site
jekyll --server --auto --base-url '/select2' --pygments --no-lsi --safe
