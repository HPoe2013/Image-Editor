/** Class to control the layer system. */
export default function () {
	this._frame = null;			// The pan zoom frame in which in the canvases live.
	this._activeLayer = null;	// The currently active canvas.

	this._nextInd = 1;			// The index of the next canvas that's created.

	/**
	 * Constructor for the layer controller.
	 * @param  {DOM Node} frame The pan-zoom frame for the layer controller.
	 * @param  {Image[]} data  Optional extra layers to initialize with.
	 */
	let _ctor = function (frame, data) {
		this._frame = frame;

		this._activeLayer = this._frame.querySelector('.layer:last-of-type');

		this._controls = this._frame.parentNode.querySelector('#layer-controls');

		this._controls.querySelector('#add-layer').addEventListener('click', _addLayer.bind(this));

		this._activeLayer.style.zIndex = 0;

		let index = this._activeLayer.dataset.index;

		let displayLayers = this._controls.querySelectorAll('.disp-layer');

		let activeDisp = Array.prototype.find.call(displayLayers, (layer) => {
			return layer.dataset.linked === index;
		});

		activeDisp.classList.add('active');
		activeDisp.addEventListener('click', _setActiveLayer.bind(this, this._activeLayer));

		if (Array.isArray(data)) {
			for (let i = 1; i < data.length; i++) {
				_addLayer.call(this, data[i]);
			};
		}
	};

	/**
	 * Adds a new layer to the canvas.
	 * @param  {Image} img Optional image to render to new layer.
	 */
	let _addLayer = function (img) {
		let newCanvas = document.createElement('canvas');
		newCanvas.classList.add('layer');
		newCanvas.dataset.index = this._nextInd;
		newCanvas.height = this._activeLayer.height;
		newCanvas.width = this._activeLayer.width;

		newCanvas.style.transform = this._activeLayer.style.transform;
		newCanvas.style.zIndex = this._nextInd;

		if (img != null && img instanceof window.HTMLImageElement) {
			newCanvas.getContext('2d').drawImage(img, 0, 0);
		}

		let newLayer = document.createElement('div');
		newLayer.classList.add('disp-layer');
		newLayer.dataset.linked = this._nextInd;

		newLayer.addEventListener('click', _setActiveLayer.bind(this, newCanvas));

		this._frame.prepend(newCanvas);
		this._controls.querySelector('#layer-display').prepend(newLayer);

		_setActiveLayer.call(this, newCanvas);

		this._nextInd++;
	};

	/**
	 * Sets the active layer.
	 * @param  {Canvas} layer The canvas to set as active.
	 */
	let _setActiveLayer = function (layer) {
		this._activeLayer = layer;

		let active = this._controls.querySelector('.disp-layer.active');
		if (active != null) active.classList.remove('active');

		let index = this._activeLayer.dataset.index;

		let displayLayers = this._controls.querySelectorAll('.disp-layer');

		let activeDisp = Array.prototype.find.call(displayLayers, (dispLayer) => {
			return dispLayer.dataset.linked === index;
		});

		activeDisp.classList.add('active');
	};

	/**
	 * Gets the currently active canvas.
	 * @return {Canvas} The currently active canvas.
	 */
	this.getActiveCanvas = function () {
		return this._activeLayer;
	};

	_ctor.apply(this, arguments);
};
