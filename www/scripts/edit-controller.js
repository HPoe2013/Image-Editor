const PanZoomController = require('./pan-zoom-controller');
const ActionHandler = require('./action-handler');
const LayerController = require('./layer-controller');

/** Class to control the editor window. */
let EditController = function () {
	this._pane = null;	// DOM element for the editor pane.

	/**
	 * Constructor for the editor controller.
	 * @param  {DOM Node}  pane   The editor DOM Node
	 * @param  {Boolean} isProj Denotes whether a project was loaded.
	 * @param  {String / String[]}  file   The file data to load onto the canvas.
	 * @param  {JSON}  dims   The canvas dimensions.
	 */
	let _ctor = function (pane, isProj, file, dims) {
		this._pane = pane;

		window.addEventListener('save-file-named', _saveFile.bind(this));

		if (isProj && file == null && dims != null) _createFile.call(this, dims);
		else _openFile.call(this, isProj, file);
	};

	/**
	 * Helper function to create the editor window.
	 * @param  {JSON} dims The dimensions of the canvas.
	 */
	let _createFile = function (dims) {
		let canvas = document.querySelector('canvas.layer');

		canvas.height = dims.height;
		canvas.width = dims.width;

		_initControllers.call(this, dims.height, dims.width);
	};

	/**
	 * Handler for when file loading is complete.
	 * @param  {Image} img  The image loaded to the base canvas layer.
	 * @param  {Image[]} data A list of images to render (the layers).
	 */
	let _fileOpened = function (img, data) {
		let canvas = document.querySelector('canvas.layer');

		canvas.height = img.height;
		canvas.width = img.width;

		canvas.getContext('2d').drawImage(img, 0, 0);

		_initControllers.call(this, img.height, img.width, data);
	};

	/**
	 * Helper function to initialize controllers.
	 * @param  {Number} height The height of the canvas.
	 * @param  {Number} width  The width of the canvas.
	 * @param  {Image[]} data   The data for other layers not yet rendered.
	 */
	let _initControllers = function (height, width, data) {
		let zoomFrame = document.getElementById('pan-zoom-frame');
		let panZoomCtrl = new PanZoomController(zoomFrame, {
			height: height,
			width: width
		});

		let layerCtrl = new LayerController(zoomFrame, data);

		this._actionHandler = new ActionHandler(zoomFrame, panZoomCtrl, layerCtrl);
	};

	/**
	 * Helper function to load file from disk.
	 * @param  {Boolean} isProj Denotes whether or not it's a project file.
	 * @param  {JSON | String}  data   Image file path for an image file or data for project file.
	 */
	let _openFile = function (isProj, data) {
		if (!isProj) {
			// If not project file, load the image.
			let img = new window.Image();
			img.src = data;

			img.onload = _fileOpened.bind(this, img);
		} else {
			// If it is a project file, load all the layers.
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

	/**
	 * Handler for "save-file-named" event, sends the file data to be saved.
	 * @param  {CustomEvent} e The triggering event.
	 */
	let _saveFile = function (e) {
		let toWrite = null;
		if (e.detail.export) {
			// If exporting, flatten layers.
			let layers = this._pane.querySelectorAll('canvas.layer');
			let outCanvas = document.createElement('canvas');

			outCanvas.height = layers[0].height;
			outCanvas.width = layers[0].width;

			let outContext = outCanvas.getContext('2d');

			for (let i = layers.length - 1; i >= 0; i--) {
				outContext.drawImage(layers[i], 0, 0);
			}

			toWrite = outCanvas.toDataURL();
		} else {
			// If not exporting (project file), build project data.
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

		// Send the save file event with file name and data to write.
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

module.exports = EditController;
