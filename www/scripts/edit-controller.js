const PanZoomController = require('./pan-zoom-controller');
const ActionHandler = require('./action-handler');
const LayerController = require('./layer-controller');

/** Class to control the editor window. */
let EditController = function () {
	this._pane = null;	// DOM element for the editor pane.

	this._ctor.apply(this, arguments);
};

/**
* Constructor for the editor controller.
* @param  {DOM Node}  pane   The editor DOM Node
* @param  {Boolean} isProj Denotes whether a project was loaded.
* @param  {String / String[]}  file   The file data to load onto the canvas.
* @param  {JSON}  dims   The canvas dimensions.
*/
EditController.prototype._ctor = function (pane, isProj, file, dims) {
	this._pane = pane;

	window.addEventListener('save-file-named', this._saveFile.bind(this));

	if (isProj && file == null && dims != null) this._createFile(dims);
	else this._openFile(isProj, file);
};

/**
 * Helper function to create the editor window.
 * @param  {JSON} dims The dimensions of the canvas.
 */
EditController.prototype._createFile = function (dims) {
	let canvas = window.document.querySelector('canvas.layer');

	canvas.height = dims.height;
	canvas.width = dims.width;

	this._initControllers(dims.height, dims.width);
};

/**
 * Handler for when file loading is complete.
 * @param  {Image} img  The image loaded to the base canvas layer.
 * @param  {Image[]} data A list of images to render (the layers).
 */
EditController.prototype._fileOpened = function (img, data) {
	let canvas = window.document.querySelector('canvas.layer');

	canvas.height = img.height;
	canvas.width = img.width;

	canvas.getContext('2d').drawImage(img, 0, 0);

	this._initControllers(img.height, img.width, data);
};

/**
 * Helper function to initialize controllers.
 * @param  {Number} height The height of the canvas.
 * @param  {Number} width  The width of the canvas.
 * @param  {Image[]} data   The data for other layers not yet rendered.
 */
EditController.prototype._initControllers = function (height, width, data) {
	let zoomFrame = window.document.getElementById('pan-zoom-frame');
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
EditController.prototype._openFile = function (isProj, data) {
	if (!isProj) {
		// If not project file, load the image.
		let img = new window.Image();
		img.src = data;

		img.onload = this._fileOpened.bind(this, img);
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
			this._fileOpened(imgs[0], imgs);
		});
	}
};

/**
 * Handler for "save-file-named" event, sends the file data to be saved.
 * @param  {CustomEvent} e The triggering event.
 */
EditController.prototype._saveFile = function (e) {
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

		let downloadLink = document.querySelector('#file-download-link');
		downloadLink.href = toWrite;
		downloadLink.click();
	} else {
		alert('project files not currently supported');
	}
};

module.exports = EditController;
