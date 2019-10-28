import DrawController from '../drawing-controller';
import Toolbox from '../toolbox';
/** Set of functions for the eraser tool */
export default {
	params: {
		'stroke': {
			default: 5,
			init: function (displayNode, data) {
				let input = displayNode.querySelector('input');
				input.value = data.default;
			}
		}
	},
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
		let stroke = Toolbox.getParamBox('stroke');
		stroke = stroke.querySelector('input').value;

		DrawController.eraseLine(this._layers.getActiveCanvas(), this._lastMouseCoord, currCoords, stroke);
		this._lastMouseCoord = currCoords;
	},
	mouseup: function (e) {
		this._active = false;
	}
};
