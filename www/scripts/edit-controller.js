import PanZoomController from './pan-zoom-controller';

export default function () {
	this._pane = null;
	this._file = null;

	this._img = null;

	this.panZoomCtrl = null;

	let _ctor = function (pane, file) {
		this._pane = pane;
		this._file = file;

		_openFile.call(this);
	};

	let _fileOpened = function () {
		let canvas = document.querySelector('canvas.layer');

		canvas.height = this._img.height;
		canvas.width = this._img.width;

		canvas.getContext('2d').drawImage(this._img, 0, 0);

		let zoomFrame = document.getElementById('pan-zoom-frame');
		this.panZoomCtrl = new PanZoomController(zoomFrame, {
			height: this._img.height,
			width: this._img.width
		});
	};

	let _openFile = function () {
		this._img = new window.Image();
		this._img.src = this._file;

		this._img.onload = _fileOpened.bind(this);
	};

	_ctor.apply(this, arguments);
};
