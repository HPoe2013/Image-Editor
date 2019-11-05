const electron = require('electron');
const { app, BrowserWindow } = electron;
const MenuCtrl = require('./electron-scripts/menu-controller');

const path = require('path');

// Keep reference to main window so it doesn't get garbage collected.
let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 1050,
		webPreferences: {
			preload: path.join(__dirname, 'electron-scripts', 'preload.js')
		}
	});

	mainWindow.setTitle('Image Editor');
	mainWindow.loadURL(`file://${__dirname}/dist/www/index.html`);

	mainWindow.toggleDevTools();

	mainWindow.on('closed', () => {
		mainWindow = null;
		process.exit(0);
	});

	MenuCtrl.init(mainWindow);
});
