const { dialog, ipcMain } = require('electron');
const BSON = require('bson');

const fileSys = require('fs');
const path = require('path');

let loadProjFile = function (filePath) {
	return new Promise((resolve, reject) => {
		fileSys.readFile(filePath, (err, data) => {
			if (err) reject(err);
			else resolve(BSON.deserialize(data));
		});
	});
};

module.exports = new function () {
	this.openDialog = function (win, opts) {
		let options = {
			title: 'Open...',
			buttonLabel: 'Open'
		};

		let combinedOpts = Object.assign(options, opts);

		return new Promise((resolve, reject) => {
			dialog.showOpenDialog(win, combinedOpts, (files) => {
				let isProj = false;
				let file = files[0] != null ? files[0] : null;

				if (file != null) {
					isProj = path.extname(file) === '.poe';
				}

				if (isProj) {
					loadProjFile(file).then(data => {
						resolve({isProj: true, file: data});
					});
				} else resolve({isProj: false, file});
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
			dialog.showSaveDialog(win, combinedOpts, resolve);
		});
	};

	this.saveFile = function (path, data) {
		return new Promise((resolve, reject) => {
			fileSys.writeFile(path, data, err => {
				if (err) reject(err);
				else resolve();
			});
		});
	};

	ipcMain.on('save-file', (evt, data) => {
		this.saveFile(data.file, BSON.serialize(data.data));
	});
}();
