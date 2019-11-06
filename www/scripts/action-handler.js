import Toolbox from './toolbox';
import ToolKit from './tools/toolkit';

/** Class to handle user actions on the editor pane. */
export default function () {
	this._frame = null;				// The pan-zoom-frame of the editor panel to which this is linked.
	this._panZoom = null;			// The pan-zoom controller for the pan-zoom-frame.
	this._layers = null;			// The layer controller for this editor window.

	this._active = false;			// Whether or not there is an action currently happening.

	this._downKeys = [];			// Array of currently depressed keys.

	this._lastMouseCoord = null;	// Reference to the last mouse event's coordinates.

	/**
	 * Constructor for the action handler.
	 * @param  {DOM Node} frame       The pan-zoom-frame of the editor window.
	 * @param  {PanZoomController} panZoomCtrl The pan-zoom controller for the editor window.
	 * @param  {LayerController} layerCtrl   The layer controller for the editor window.
	 */
	let _ctor = function (frame, panZoomCtrl, layerCtrl) {
		this._frame = frame;
		this._panZoom = panZoomCtrl;
		this._layers = layerCtrl;

		this._frame.addEventListener('mousedown', _handleMouseDown.bind(this));
		this._frame.addEventListener('mousemove', _handleMouseMove.bind(this));
		this._frame.addEventListener('mouseup', _handleMouseUp.bind(this));

		window.addEventListener('keydown', _handleKeyDown.bind(this));
		window.addEventListener('keyup', _handleKeyUp.bind(this));

		window.addEventListener('wheel', _handleWheel.bind(this));
	};

	/**
	 * Handler for key down event to add it to down keys array.
	 * @param  {KeyboardEvent} e The triggering event.
	 */
	let _handleKeyDown = function (e) {
		if (this._downKeys.indexOf(e.code) === -1) {
			this._downKeys.push(e.code);
		}
	};

	/**
	 * Handler for key up event to remove it from the down keys array.
	 * @param  {KeyboardEvent} e The triggering event.
	 */
	let _handleKeyUp = function (e) {
		let index = this._downKeys.indexOf(e.code);
		if (index !== -1) this._downKeys.splice(index, 1);
	};

	/**
	 * Handler for the mouse down event, activates tool
	 * @param  {MouseEvent} e The triggering event.
	 */
	let _handleMouseDown = function (e) {
		if (this._downKeys.indexOf('Space') !== -1) {
			this._tool = 'panner';
		} else {
			this._tool = Toolbox.getActiveTool();
		}

		ToolKit[this._tool].mousedown.call(this, e);
	};

	/**
	 * Handler for the mouse move event, calls to tool
	 * @param  {MouseEvent} e The triggering event.
	 */
	let _handleMouseMove = function (e) {
		if (this._active) ToolKit[this._tool].mousemove.call(this, e);
	};

	/**
	 * Handler for the mouse up event, deactivates tool
	 * @param  {MouseEvent} e The triggering event.
	 */
	let _handleMouseUp = function (e) {
		ToolKit[this._tool].mouseup.call(this, e);
	};

	let _handleWheel = function (e) {
		let index = this._downKeys.findIndex((key) => {
			return key.indexOf('Alt') !== -1;
		});

		if (index === -1) return;

		let mult = e.deltaY > 0 ? -1 : 1;
		this._panZoom.zoom(mult);
	};

	_ctor.apply(this, arguments);
};
