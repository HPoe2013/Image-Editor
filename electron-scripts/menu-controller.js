const { Menu, ipcMain } = require('electron');
const MenuTemplate = require('./menu-template');
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
		this.enableItemById('saveItem');
		this._win.webContents.send('file-open');
	});

	Emitter.on('save-file', () => {
		this.enableItemById('saveItem');
		this._win.webContents.send('save-file-named');
	});

	Emitter.on('new-file', () => {
		this.enableItemById('saveItem');
		this._win.webContents.send('new-file');
	});
}();
