#!/bin/bash
set -e

echo -n "Enter the version for this release: "

read ver

if [ ! $ver ]; then
	echo "Invalid version."
	exit
fi

name="select2"
js="$name.js"
mini="$name.min.js"
less="$name.less"
css="$name.css"
minicss="$name.min.css"
release="$name-$ver"
tag="$ver"
branch="build-$ver"
curbranch=`git branch | grep "*" | sed "s/* //"`
remote="github"

echo "Updating Version Identifiers"

sed -E -e "s/\"version\": \"([0-9\.]+)\",/\"version\": \"$ver\",/g" -i "" package.json
grunt sed:descriptorversion
git add package.json
git add bower.json
git add select2.jquery.json
git commit -m "modified version identifiers in descriptors for release $ver"
#git push

git branch "$branch"
git checkout "$branch"

echo "Minifying..."

grunt uglify
grunt less

echo "Tokenizing..."

grunt sed:fileversion
grunt sed:filetime

git add "$js"
git add "$mini"
git add "$less"
git add "$css"
git add "$minicss"

git commit -m "release $ver"

echo "Tagging..."
git tag -a "$tag" -m "tagged version $ver"
git push "$remote" --tags

echo "Cleaning Up..."

git checkout "$curbranch"
git branch -D "$branch"

echo "Done"
