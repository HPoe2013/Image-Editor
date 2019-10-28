const { Menu, ipcMain } = require('electron');
const MenuTemplate = require('./menu-template');
const FileController = require('./file-controller');
const Emitter = require('./events');

module.exports = new function () {
	this._win = null;

	this.init = function (win) {
		Menu.setApplicationMenu(Menu.buildFromTemplate(MenuTemplate(win)));
		this._win = win;
		this.disableItemById('saveItem');
	};

	this.disableItemById = function (id) {
		let menu = Menu.getApplicationMenu();
		let item = menu.getMenuItemById(id);

		item.enabled = false;
	};

	this.enableItemById = function (id) {
		let menu = Menu.getApplicationMenu();
		let item = menu.getMenuItemById(id);

		item.enabled = true;
	};

	ipcMain.on('enable', (evt, arg) => {
		this.enableItemById(arg);
	});

	Emitter.on('open-file', () => {
		FileController.openDialog(
			this._win, {
				'title': 'Select file',
				'filters': [{
					name: 'Supported Files',
					extensions: ['poe', 'png', 'jpg']
				}]
			}
		).then((file) => {
			if (file != null) {
				this.enableItemById('saveItem');
				this._win.webContents.send('file-open', file);
			}
		});
	});

	Emitter.on('save-file', () => {
		FileController.saveDialog(
			this._win,
			{
				'title': 'Save file',
				'filters': [{
					name: 'Picture Object for Editing',
					extensions: ['poe']
				}]
			}
		).then((file) => {
			if (file != null) {
				this._win.webContents.send('save-file-named', file);
			}
		});
	});

	Emitter.on('new-file', () => {
		this.enableItemById('saveItem');
		this._win.webContents.send('new-file');
	});

	Emitter.on('export-file', () => {
		FileController.saveDialog(
			this._win,
			{
				'title': 'Save file',
				'filters': [{
					name: 'Image File',
					extensions: ['png']
				}]
			}
		).then((file) => {
			if (file != null) {
				this._win.webContents.send('export-file-named', { file, export: true });
			}
		});
	});
}();
