const { ipcRenderer } = require('electron');

ipcRenderer.on('file-open', (event, file) => {
	let evt = new window.CustomEvent(
		'file-open',
		{
			detail: {
				file
			}
		}
	);

	window.dispatchEvent(evt);
});
