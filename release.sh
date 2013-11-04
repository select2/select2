#!/bin/sh
set -e
#set -vx

function usage() {
	echo USAGE $0 -v [version] -n [next version] -m [next milestone]
	exit
}

version=""
nextversion=""
nextmilestone=""

while getopts "v:n:m:" opt; do
	case $opt in
		v) version="$OPTARG"
			;;
		n) nextversion="$OPTARG"
			;;
		m) nextmilestone="$OPTARG"
			;;
	esac
done

if [ "x" == "x$version" ]; then
	echo ERROR: version not specified
	usage
fi


if [ "x" == "x$nextversion" ]; then
	echo ERROR: next version not specified
	usage
fi

if [ "x" == "x$nextmilestone" ]; then
	echo ERROR: next milestone not specified
	usage
fi

versiondir="select2-$version"
versionregex="${version//./\\.}"
nextversionregex="${nextversion//./\\.}"

echo "DOWNLOADING RELEASE"
wget "https://github.com/ivaynberg/select2/archive/$version.tar.gz"
tar xvzf "$version.tar.gz"
rm -f "$version.tar.gz"

rm index.html
cp select2-latest.html index.html

sed -e "s/title: Select2 Latest/title: Select2 $versionregex/" -i bak index.html
sed -e "s/select2-master\//select2-$versionregex\//" -i bak index.html
sed -e "/<!-- unreleased -->/d" -i bak index.html
sed -e "s/version: .*/version: $versionregex/" -i bak index.html

sed -e "s/version: .*/version: $nextversionregex/" -i bak select2-latest.html
sed -e "s/milestone: .*/milestone: $nextmilestone/" -i bak select2-latest.html
rm index.htmlbak
rm select2-latest.htmlbak

git add .
git commit -m "release $version"

echo 
echo
echo DO NOT FORGET TO PUSH
echo
echo
echo PRESS ANY KEY TO START JEKYLL
read -n 1 -s
./jekyll.sh

