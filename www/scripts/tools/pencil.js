import Toolbox from '../toolbox';
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

		let color = Toolbox.getMainColor();

		let currCoords = { x: e.offsetX, y: e.offsetY };
		DrawController.drawLine(this._layers.getActiveCanvas(), this._lastMouseCoord, currCoords, color);
		this._lastMouseCoord = currCoords;
	},
	mouseup: function (e) {
		this._active = false;
	}
};
