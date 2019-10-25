export default {
	mousedown: function (e) {
		this._active = true;

		this._lastMouseCoord = {
			x: e.offsetX,
			y: e.offsetY
		};
	},
	mousemove: function (e) {
		if (!this._active) return;

		let currCoords = { x: e.offsetX, y: e.offsetY };

		let dx = currCoords.x - this._lastMouseCoord.x;
		let dy = currCoords.y - this._lastMouseCoord.y;

		this._panZoom.pan(dx, dy);

		this._lastMouseCoord = currCoords;
	},
	mouseup: function (e) {
		this._active = false;
	}
};
