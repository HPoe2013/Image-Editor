const { dialog } = require('electron');
const fileSys = require('fs');

module.exports = new function () {
	this.load = function (file) {};

	this.openDialog = function (win, opts) {
		let options = {
			title: 'Open...',
			buttonLabel: 'Open'
		};

		let combinedOpts = Object.assign(options, opts);

		return new Promise((resolve, reject) => {
			dialog.showOpenDialog(win, combinedOpts, (files) => {
				let file = files[0] != null ? files[0] : null;
				resolve(file);
			});
		});
	};
}();
