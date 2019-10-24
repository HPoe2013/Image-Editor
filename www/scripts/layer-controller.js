export default function () {
	this._frame = null;
	this._activeLayer = null;

	let _ctor = function (frame, data) {
		this._frame = frame;

		this._activeLayer = this._frame.querySelector('.layer');
	};

	this.getActiveCanvas = function () {
		return this._activeLayer;
	};

	_ctor.apply(this, arguments);
};
