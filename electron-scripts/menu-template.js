const Emitter = require('./events');

module.exports = () => {
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
				{ role: 'quit' }
			]
		}
	];
};
