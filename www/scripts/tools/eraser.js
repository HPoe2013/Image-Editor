const DrawController = require('../drawing-controller');
const Tool = require('../tool');

let Eraser = new function () {
	let params = {
		'stroke': {
			default: 5,
			init: function (displayNode, data) {
				let input = displayNode.querySelector('input');
				input.value = data.default;
			}
		}
	};

	Tool.call(this, 'eraser', params);

	this.mousedown = function (toolbox, e) {
		this._active = true;

		this._lastMouseCoord = {
			x: e.offsetX,
			y: e.offsetY
		};
	};

	this.mousemove = function (toolbox, e) {
		if (!this._active) return;

		let currCoords = { x: e.offsetX, y: e.offsetY };
		let stroke = toolbox.getParamBox('stroke');
		stroke = stroke.querySelector('input').value;

		DrawController.eraseLine(this._layers.getActiveCanvas(), this._lastMouseCoord, currCoords, stroke);
		this._lastMouseCoord = currCoords;
	};

	this.mouseup = function (toolbox, e) {
		this._active = false;
	};
}();

module.exports = Eraser;
