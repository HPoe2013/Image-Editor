import PanZoomController from './pan-zoom-controller';
import DrawController from './drawing-controller';

export default function () {
	this._pane = null;

	this.panZoomCtrl = null;

	let _ctor = function (pane, isProj, file, dims) {
		this._pane = pane;

		window.addEventListener('save-file-named', _saveFile.bind(this));

		if (isProj && file == null && dims != null) _createFile.call(this, dims);
		else _openFile.call(this, isProj, file);
	};

	let _createFile = function (dims) {
		let canvas = document.querySelector('canvas.layer');

		canvas.height = dims.height;
		canvas.width = dims.width;

		let zoomFrame = document.getElementById('pan-zoom-frame');
		this.panZoomCtrl = new PanZoomController(zoomFrame, {
			height: dims.height,
			width: dims.width
		});
	};

	let _fileOpened = function (img) {
		let canvas = document.querySelector('canvas.layer');

		canvas.height = img.height;
		canvas.width = img.width;

		canvas.getContext('2d').drawImage(img, 0, 0);

		let zoomFrame = document.getElementById('pan-zoom-frame');
		this.panZoomCtrl = new PanZoomController(zoomFrame, {
			height: img.height,
			width: img.width
		});
	};

	let _openFile = function (isProj, data) {
		let src = !isProj ? data : data.layers[0];

		let img = new window.Image();
		img.src = src;

		img.onload = _fileOpened.bind(this, img);
	};

	let _saveFile = function (e) {
		let toWrite = null;
		if (e.detail.export) {
			// TODO: Flatten layers

			let layer = this._pane.querySelectorAll('canvas.layer')[0];
			toWrite = layer.toDataURL();
		} else {
			let layers = this._pane.querySelectorAll('canvas.layer');
			toWrite = {
				canvasDim: {},
				layers: []
			};

			Array.prototype.forEach.call(layers, layer => {
				toWrite.canvasDim.height = layer.height;
				toWrite.canvasDim.width = layer.width;
				toWrite.layers[layer.dataset.index] = layer.toDataURL();
			});
		}

		window.dispatchEvent(new window.CustomEvent(
			'save-file', {
				detail: {
					file: e.detail.file,
					data: toWrite
				}
			}
		));
	};

	_ctor.apply(this, arguments);
};
