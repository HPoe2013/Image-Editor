import Toolbox from './toolbox';
import ToolKit from './tools/toolkit';

export default function () {
	this._frame = null;
	this._panZoom = null;
	this._layers = null;

	this._active = false;

	this._downKeys = [];

	this._lastMouseCoord = null;

	let _ctor = function (frame, panZoomCtrl, layerCtrl) {
		this._frame = frame;
		this._panZoom = panZoomCtrl;
		this._layers = layerCtrl;

		this._frame.addEventListener('mousedown', _handleMouseDown.bind(this));
		this._frame.addEventListener('mousemove', _handleMouseMove.bind(this));
		this._frame.addEventListener('mouseup', _handleMouseUp.bind(this));

		window.addEventListener('keydown', _handleKeyDown.bind(this));
		window.addEventListener('keyup', _handleKeyUp.bind(this));
	};

	let _handleKeyDown = function (e) {
		if (this._downKeys.indexOf(e.code) === -1) {
			this._downKeys.push(e.code);
		}
	};

	let _handleKeyUp = function (e) {
		let index = this._downKeys.indexOf(e.code);
		if (index !== -1) this._downKeys.splice(index, 1);
	};

	let _handleMouseDown = function (e) {
		if (this._downKeys.indexOf('Space') !== -1) {
			this._tool = 'panner';
		} else {
			this._tool = Toolbox.getActiveTool();
		}

		ToolKit[this._tool].mousedown.call(this, e);
	};

	let _handleMouseMove = function (e) {
		ToolKit[this._tool].mousemove.call(this, e);
	};

	let _handleMouseUp = function (e) {
		ToolKit[this._tool].mouseup.call(this, e);
	};

	_ctor.apply(this, arguments);
};
