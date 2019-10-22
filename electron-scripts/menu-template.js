const FileController = require('./file-controller');

let openFile = function (win) {
	FileController.openDialog(
		win,
		{
			'title': 'Select file'
		}
	).then((file) => {
		if (file != null) {
			// MenuCtrl.enableItemById('saveItem');
			win.webContents.send('file-open', file);
		}
	});
};

let saveFile = function (win) {
	FileController.saveDialog(
		win,
		{
			'title': 'Save file',
			'filters': [{
				name: 'Picture Object for Editing',
				extensions: ['poe']
			}]
		}
	).then((file) => {
		if (file != null) {
			win.webContents.send('save-file', file);
		}
	});
};

module.exports = (currWindow) => {
	return [
		{
			label: 'File',
			role: 'filemenu',
			submenu: [
				{
					label: 'Open File',
					role: 'open',
					accelerator: 'CmdOrCtrl+O',
					click () {
						openFile(currWindow);
					}
				}, {
					label: 'Save File',
					accelerator: 'CmdOrCtrl+S',
					id: 'saveItem',
					role: 'save',
					click () {
						saveFile(currWindow);
					}
				},
				{ type: 'separator' },
				{ role: 'quit' }
			]
		}
	];
};
