export default function () {
	this._frame = null;

	this._height = null;
	this._width = null;

	this._top = 0;
	this._left = 0;

	let _ctor = function (frame, dim) {
		this._frame = frame;

		this._height = dim.height;
		this._width = dim.width;

		this._scaleDisplay = frame.parentNode.querySelector('#scale');

		_resize.call(this);
		window.addEventListener('resize', _resize.bind(this));
	};

	let _recenter = function () {
		let bounds = this._frame.getBoundingClientRect();

		this._top = (window.innerHeight - bounds.height) / 2;
		this._left = (window.innerWidth - bounds.width) / 2;

		_updatePos.call(this);
	};

	let _resize = function () {
		let bounds = this._frame.getBoundingClientRect();

		let imgR = this._width / this._height;
		let boundsR = bounds.width / bounds.height;

		var scale = boundsR < imgR
			? bounds.width / this._width
			: bounds.height / this._height;

		scale = Math.floor(scale * 100);
		_updateScale.call(this, scale);
		_recenter.call(this);
	};

	let _updatePos = function () {
		this._frame.style.top = this._top + 'px';
		this._frame.style.left = this._left + 'px';
	};

	let _updateScale = function (scale) {
		let canvases = this._frame.querySelectorAll('canvas.layer');
		Array.prototype.forEach.call(canvases, (canvas) => {
			canvas.style.transform = 'scale(#)'.replace('#', scale / 100);
		});

		this._scaleDisplay.innerHTML = scale + '%';
	};

	this.pan = function (dx, dy) {
		this._left += dx;
		this._top += dy;

		_updatePos.call(this);
	};

	_ctor.apply(this, arguments);
};
