var path = require('path');
module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',

				options: {
				}
			},

			{
				test: /\.(scss|css)$/,

				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},

	plugins: [],
	entry: './www/scripts/driver.js',

	output: {
		filename: 'final-bundle.js',
		path: path.resolve(__dirname, '../../dist/www/scripts')
	},

	mode: 'development'
};
