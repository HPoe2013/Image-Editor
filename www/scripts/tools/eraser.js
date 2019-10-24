import DrawController from '../drawing-controller';

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
		DrawController.eraseLine(this._layers.getActiveCanvas(), this._lastMouseCoord, currCoords, 'rgba(0, 0, 0, 0.0)');
		this._lastMouseCoord = currCoords;
	},
	mouseup: function (e) {
		this._active = false;
	}
};
