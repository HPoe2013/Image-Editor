import PanZoomController from './pan-zoom-controller';
import ActionHandler from './action-handler';
import LayerController from './layer-controller';

export default function () {
	this._pane = null;

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

		_initControllers.call(this, dims.height, dims.width);
	};

	let _fileOpened = function (img, data) {
		let canvas = document.querySelector('canvas.layer');

		canvas.height = img.height;
		canvas.width = img.width;

		canvas.getContext('2d').drawImage(img, 0, 0);

		_initControllers.call(this, img.height, img.width, data);
	};

	let _initControllers = function (height, width, data) {
		let zoomFrame = document.getElementById('pan-zoom-frame');
		let panZoomCtrl = new PanZoomController(zoomFrame, {
			height: height,
			width: width
		});

		let layerCtrl = new LayerController(zoomFrame, data);

		this._actionHandler = new ActionHandler(zoomFrame, panZoomCtrl, layerCtrl);
	};

	let _openFile = function (isProj, data) {
		if (!isProj) {
			let img = new window.Image();
			img.src = data;

			img.onload = _fileOpened.bind(this, img);
		} else {
			let imgProms = data.layers.map(layer => {
				return new Promise((resolve, reject) => {
					let img = new window.Image();
					img.src = layer;

					img.onload = () => {
						resolve(img);
					};
				});
			});

			Promise.all(imgProms).then((imgs) => {
				_fileOpened.call(this, imgs[0], imgs);
			});
		}
	};

	let _saveFile = function (e) {
		let toWrite = null;
		if (e.detail.export) {
			// Flatten layers
			let layers = this._pane.querySelectorAll('canvas.layer');
			let outCanvas = document.createElement('canvas');

			outCanvas.height = layers[0].height;
			outCanvas.width = layers[0].width;

			let outContext = outCanvas.getContext('2d');

			for (let i = layers.length - 1; i >= 0; i--) {
				console.log('layer', layers[i]);
				outContext.drawImage(layers[i], 0, 0);
			}

			toWrite = outCanvas.toDataURL();
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
