const FileController = require('./file-controller');

module.exports = (currWindow) => {
	return [
		...(process.platform === 'darwin' ? [{
			label: 'label',
			submenu: [
				{ role: 'about' },
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideothers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' }
			]
		}] : []),
		{
			label: 'File',
			submenu: [
				{ role: 'quit' },
				{
					label: 'Open File',
					accelerator: 'CmdOrCtrl+O',
					click () {
						FileController.openDialog(
							currWindow,
							{
								'title': 'Select file'
							}
						).then((file) => {
							if (file != null) {
								currWindow.webContents.send('file-open', file);
							}
						});
					}
				}
			]
		}
	];
};
