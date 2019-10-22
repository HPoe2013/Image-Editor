export default function () {
	this._frame = null;

	this._height = null;
	this._width = null;

	let _ctor = function (frame, dim) {
		this._frame = frame;

		this._height = dim.height;
		this._width = dim.width;

		this._scaleDisplay = frame.parentNode.querySelector('#scale');

		_resize.call(this);
		window.addEventListener('resize', _resize.bind(this));
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
	};

	let _updateScale = function (scale) {
		let canvases = this._frame.querySelectorAll('canvas.layer');
		Array.prototype.forEach.call(canvases, (canvas) => {
			canvas.style.transform = 'scale(#)'.replace('#', scale / 100);
		});

		this._scaleDisplay.innerHTML = scale + '%';
	};

	_ctor.apply(this, arguments);
};
