#!/bin/bash

build_toolkit_file () {
	touch ./www/scripts/tools/toolkit.js;

	exStr="module.exports = { ";

	echo "// GENERATED SCRIPT" > ./www/scripts/tools/toolkit.js;

	for file in ./www/scripts/tools/*; do
		if [ $(basename "$file") != "toolkit.js" -a $(basename "$file") != "tool.js" ] ; then
			filename=$(basename "$file" .js);
			exStr+="$filename, "
			echo "const $filename = require('./$filename');" >> ./www/scripts/tools/toolkit.js;
		fi
	done

	outStr="${exStr::-2} };"
	echo "$outStr" >> ./www/scripts/tools/toolkit.js;
}

echo "Cleaning dist directory...";
rm -rf dist/*;

echo "";
echo "Building tool file...";
build_toolkit_file;

echo "";
echo "Webpacking front end scripts...";
node_modules/.bin/webpack --config ./build/webpack/dev.config.js;

echo "";
echo "Copying other files to dist...";
cp ./www/index.html ./dist/www/index.html;
cp -r ./www/styles	./dist/www/styles
cp -r ./www/images	./dist/www/images

echo "";
NOW=$(date +"%T");
echo "Dev build finshed at $NOW";
