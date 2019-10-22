const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;
const menuTemplate = require('./electron-scripts/menu-template');

const path = require('path');

// Keep reference to main window so it doesn't get garbage collected.
let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 1050,
		// icon: path.join(__dirname, '/images/ampco-icon.png'),
		webPreferences: {
			preload: path.join(__dirname, 'electron-scripts', 'preload.js')
		}
	});

	mainWindow.setTitle('Schematic Update Tool');
	mainWindow.loadURL(`file://${__dirname}/dist/www/index.html`);

	mainWindow.toggleDevTools();
	mainWindow.setMenu(Menu.buildFromTemplate(menuTemplate(mainWindow)));

	mainWindow.on('closed', () => {
		mainWindow = null;
		process.exit(0);
	});
});
