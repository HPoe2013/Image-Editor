/** Set of functions for the panning tool */
export default {
	mousedown: function (e) {
		this._active = true;

		this._lastMouseCoord = {
			x: e.clientX,
			y: e.clientY
		};
	},
	mousemove: function (e) {
		if (!this._active) return;

		let currCoords = { x: e.clientX, y: e.clientY };

		let dx = currCoords.x - this._lastMouseCoord.x;
		let dy = currCoords.y - this._lastMouseCoord.y;

		this._panZoom.pan(dx, dy);

		this._lastMouseCoord = currCoords;
	},
	mouseup: function (e) {
		this._active = false;
	}
};
