const { ipcRenderer } = require('electron');

ipcRenderer.on('file-open', () => {
	window.dispatchEvent(new window.CustomEvent(
		'file-open'
	));
});

ipcRenderer.on('save-file-named', (evt, file) => {
	window.dispatchEvent(new window.CustomEvent(
		'save-file-named', {
			detail: {
				file: 'export.png',
				export: true
			}
		}
	));
});

ipcRenderer.on('new-file', evt => {
	window.dispatchEvent(new window.CustomEvent(
		'new-file', {
			detail: {
				height: 500,
				width: 500
			}
		}
	));
});

ipcRenderer.on('export-file-named', (evt, data) => {
	window.dispatchEvent(new window.CustomEvent(
		'save-file-named', { detail: data }
	));
});

window.addEventListener('save-file', e => {
	ipcRenderer.send('save-file', e.detail);
});
