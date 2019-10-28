import Toolbox from '../toolbox';
import DrawController from '../drawing-controller';

/** Set of functions for the pencil tool */
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

		let color = Toolbox.getMainColor();

		let stroke = Toolbox.getParamBox('stroke');
		stroke = stroke.querySelector('input').value;

		let currCoords = { x: e.offsetX, y: e.offsetY };
		DrawController.drawLine(this._layers.getActiveCanvas(), this._lastMouseCoord, currCoords, color, stroke);
		this._lastMouseCoord = currCoords;
	},
	mouseup: function (e) {
		this._active = false;
	}
};
