import Toolbox from './toolbox';
import ToolKit from './tools/toolkit';

export default function () {
	this._frame = null;
	this._panZoom = null;
	this._layers = null;

	this._active = false;

	this._lastMouseCoord = null;

	let _ctor = function (frame, panZoomCtrl, layerCtrl) {
		this._frame = frame;
		this._panZoom = panZoomCtrl;
		this._layers = layerCtrl;

		this._frame.addEventListener('mousedown', _handleMouseDown.bind(this));
		this._frame.addEventListener('mousemove', _handleMouseMove.bind(this));
		this._frame.addEventListener('mouseup', _handleMouseUp.bind(this));
	};

	let _handleMouseDown = function (e) {
		let tool = Toolbox.getActiveTool();
		ToolKit[tool].default.mousedown.call(this, e);
	};

	let _handleMouseMove = function (e) {
		let tool = Toolbox.getActiveTool();
		ToolKit[tool].default.mousemove.call(this, e);
	};

	let _handleMouseUp = function (e) {
		let tool = Toolbox.getActiveTool();
		ToolKit[tool].default.mouseup.call(this, e);
	};

	_ctor.apply(this, arguments);
};
