const { dialog } = require('electron');

module.exports = new function () {
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

	this.saveDialog = function (win, opts) {
		let options = {
			title: 'Save...',
			buttonLabel: 'Save'
		};

		let combinedOpts = Object.assign(options, opts);

		return new Promise((resolve, reject) => {
			dialog.showSaveDialog(win, combinedOpts, file => {
				console.log('file', file);
			});
		});
	};
}();
