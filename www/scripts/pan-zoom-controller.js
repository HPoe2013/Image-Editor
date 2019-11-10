/** Controller for panning and zooming the layers. */
let PanZoomController = function () {
	this._ZOOM_AMT = 0.05;

	this._MIN_ZOOM = 0.05;
	this._MAX_ZOOM = 5;

	this._frame = null;		// The pan-zoom frame to which to bind.

	this._height = null;	// The height of the canvas.
	this._width = null;		// The width of the canvas.

	this._top = 0;			// The current top coordinate of the schematic.
	this._left = 0;			// The current left coordinate of teh schematic.

	this._scale = 1;
	this._canScale = null;

	/**
	 * Constructor for pan-zoom controller.
	 * @param  {DOM Node} frame The pan zoom frame to control.
	 * @param  {JSON} dim   The initial dimensions of the image.
	 */
	let _ctor = function (frame, dim) {
		this._frame = frame;

		this._height = dim.height;
		this._width = dim.width;

		this._frame.style.height = dim.height + 'px';
		this._frame.style.width = dim.width + 'px';

		this._scaleDisplay = frame.parentNode.querySelector('#scale');

		_resize.call(this);
		window.addEventListener('resize', _resize.bind(this));
	};

	/** Helper function to recenter layers. */
	let _recenter = function () {
		let bounds = this._frame.getBoundingClientRect();

		this._top = (window.innerHeight - bounds.height) / 2;
		this._left = (window.innerWidth - bounds.width) / 2;

		_updatePos.call(this);
	};

	/** Handler for resize event. Scales and re-centers canvas. */
	let _resize = function () {
		let bounds = this._frame.getBoundingClientRect();

		let imgR = this._width / this._height;
		let boundsR = bounds.width / bounds.height;

		var scale = boundsR < imgR
			? bounds.width / this._width
			: bounds.height / this._height;

		scale = Math.min(scale, 1);

		scale = Math.floor(scale * 100);
		_updateScale.call(this, scale);
		_recenter.call(this);
	};

	/** Helper function to move layers to the current top and left position. */
	let _updatePos = function () {
		this._frame.style.top = this._top + 'px';
		this._frame.style.left = this._left + 'px';
	};

	/**
	 * Helper function to update the scale on the layers.
	 * @param  {Number} scale The scale value to which to set the layers.
	 */
	let _updateScale = function (scale) {
		let canvases = this._frame.querySelectorAll('canvas.layer');
		Array.prototype.forEach.call(canvases, (canvas) => {
			canvas.style.transform = 'scale(#)'.replace('#', scale / 100);
		});

		this._canScale = scale;

		_updateScaleDisplay.call(this);
	};

	let _updateScaleDisplay = function () {
		this._scaleDisplay.innerHTML = Math.round(this._scale * this._canScale) + '%';
	};

	/**
	 * Changes the layer location by the given amounts.
	 * @param  {Number} dx The amount to move in the X direction.
	 * @param  {Number} dy The amount to move in the Y direction.
	 */
	this.pan = function (dx, dy) {
		this._left += dx;
		this._top += dy;

		_updatePos.call(this);
	};

	this.zoom = function (multiplier) {
		this._scale += this._ZOOM_AMT * multiplier;

		this._scale = Math.min(this._MAX_ZOOM, this._scale);
		this._scale = Math.max(this._MIN_ZOOM, this._scale);

		this._frame.style.transform = 'scale(#)'.replace('#', this._scale);

		_updateScaleDisplay.call(this);
	};

	_ctor.apply(this, arguments);
};

module.exports = PanZoomController;
