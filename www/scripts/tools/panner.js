let Panner = new function () {
	this.mousedown = function (toolbox, e) {
		this._active = true;

		this._lastMouseCoord = {
			x: e.clientX,
			y: e.clientY
		};
	};

	this.mousemove = function (toolbox, e) {
		if (!this._active) return;

		let currCoords = { x: e.clientX, y: e.clientY };

		let dx = currCoords.x - this._lastMouseCoord.x;
		let dy = currCoords.y - this._lastMouseCoord.y;

		this._panZoom.pan(dx, dy);

		this._lastMouseCoord = currCoords;
	};

	this.mouseup = function (toolbox, e) {
		this._active = false;
	};
}();

module.exports = Panner;
