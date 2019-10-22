echo "Cleaning dist directory...";
rm -rf dist/*;

echo "";
echo "Webpacking front end scripts...";
node_modules/.bin/webpack --config ./build/webpack/dev.config.js;

echo "";
echo "Copying other files to dist...";
cp ./www/index.html ./dist/www/index.html;

echo "";
NOW=$(date +"%T");
echo "Dev build finshed at $NOW";
