const Emitter = require('./events');

module.exports = () => {
	return [
		{
			label: 'File',
			role: 'filemenu',
			submenu: [
				{
					label: 'New Project...',
					accelerator: 'CmdOrCtrl+N',
					role: 'new',
					click () {
						Emitter.emit('new-file');
					}
				},
				{ type: 'separator' },
				{
					label: 'Open File',
					role: 'open',
					accelerator: 'CmdOrCtrl+O',
					click () {
						Emitter.emit('open-file');
					}
				}, {
					label: 'Save File',
					accelerator: 'CmdOrCtrl+S',
					id: 'saveItem',
					role: 'save',
					click () {
						Emitter.emit('save-file');
					}
				},
				{ type: 'separator' },
				{
					label: 'Export File..',
					role: 'export',
					id: 'exportItem',
					click () { Emitter.emit('export-file'); }
				},
				{ type: 'separator' },
				{ role: 'quit' }
			]
		}
	];
};
