const Toolbox = require('./toolbox');
const ToolKit = require('./tools/toolkit');

/** Class to handle user actions on the editor pane. */
let ActionHandler = function () {
	this._frame = null;				// The pan-zoom-frame of the editor panel to which this is linked.
	this._panZoom = null;			// The pan-zoom controller for the pan-zoom-frame.
	this._layers = null;			// The layer controller for this editor window.

	this._active = false;			// Whether or not there is an action currently happening.

	this._downKeys = [];			// Array of currently depressed keys.

	this._lastMouseCoord = null;	// Reference to the last mouse event's coordinates.

	this._ctor.apply(this, arguments);
};

/**
 * Constructor for the action handler.
 * @param  {DOM Node} frame       The pan-zoom-frame of the editor window.
 * @param  {PanZoomController} panZoomCtrl The pan-zoom controller for the editor window.
 * @param  {LayerController} layerCtrl   The layer controller for the editor window.
 */
ActionHandler.prototype._ctor = function (frame, panZoomCtrl, layerCtrl) {
	this._frame = frame;
	this._panZoom = panZoomCtrl;
	this._layers = layerCtrl;

	this._frame.addEventListener('mousedown', this._handleMouseDown.bind(this));
	this._frame.addEventListener('mousemove', this._handleMouseMove.bind(this));
	this._frame.addEventListener('mouseup', this._handleMouseUp.bind(this));

	window.addEventListener('keydown', this._handleKeyDown.bind(this));
	window.addEventListener('keyup', this._handleKeyUp.bind(this));

	window.addEventListener('wheel', this._handleWheel.bind(this));
};

/**
 * Handler for key down event to add it to down keys array.
 * @param  {KeyboardEvent} e The triggering event.
 */
ActionHandler.prototype._handleKeyDown = function (e) {
	if (this._downKeys.indexOf(e.code) === -1) {
		this._downKeys.push(e.code);
	}
};

/**
 * Handler for key up event to remove it from the down keys array.
 * @param  {KeyboardEvent} e The triggering event.
 */
ActionHandler.prototype._handleKeyUp = function (e) {
	let index = this._downKeys.indexOf(e.code);
	if (index !== -1) this._downKeys.splice(index, 1);
};

/**
 * Handler for the mouse down event, activates tool
 * @param  {MouseEvent} e The triggering event.
 */
ActionHandler.prototype._handleMouseDown = function (e) {
	if (this._downKeys.indexOf('Space') !== -1) {
		this._tool = 'panner';
	} else {
		this._tool = Toolbox.getActiveTool();
	}

	ToolKit[this._tool].mousedown.call(this, Toolbox, e);
};

/**
 * Handler for the mouse move event, calls to tool
 * @param  {MouseEvent} e The triggering event.
 */
ActionHandler.prototype._handleMouseMove = function (e) {
	if (ToolKit[this._tool] == null) return;

	ToolKit[this._tool].mousemove.call(this, Toolbox, e);
};

/**
 * Handler for the mouse up event, deactivates tool
 * @param  {MouseEvent} e The triggering event.
 */
ActionHandler.prototype._handleMouseUp = function (e) {
	ToolKit[this._tool].mouseup.call(this, Toolbox, e);
};

ActionHandler.prototype._handleWheel = function (e) {
	let index = this._downKeys.findIndex((key) => {
		return key.indexOf('Alt') !== -1;
	});

	if (index === -1) return;

	let mult = e.deltaY > 0 ? -1 : 1;
	this._panZoom.zoom(mult);
};

module.exports = ActionHandler;
