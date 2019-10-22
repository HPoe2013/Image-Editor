const { Menu, ipcMain } = require('electron');
const MenuTemplate = require('./menu-template');

module.exports = new function () {
	this.init = function (win) {
		Menu.setApplicationMenu(Menu.buildFromTemplate(MenuTemplate(win)));
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
}();
