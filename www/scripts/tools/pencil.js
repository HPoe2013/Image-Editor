 const DrawController = require('../drawing-controller');
const Tool = require('./tool');

let Pencil = new function () {
	let params = {
		'stroke': {
			default: 5,
			init: function (displayNode, data) {
				let input = displayNode.querySelector('input');
				input.value = data.default;
			}
		}
	};

	Tool.call(this, 'pencil', params);

	this.mousedown = function (toolbox, e) {
		this._active = true;

		this._lastMouseCoord = {
			x: e.offsetX,
			y: e.offsetY
		};
	};

	this.mousemove = function (toolbox, e) {
		if (!this._active) return;

		let color = toolbox.getMainColor();

		let stroke = toolbox.getParamBox('stroke');
		stroke = stroke.querySelector('input').value;

		let currCoords = { x: e.offsetX, y: e.offsetY };
		DrawController.drawLine(this._layers.getActiveCanvas(), this._lastMouseCoord, currCoords, color, stroke);
		this._lastMouseCoord = currCoords;
	};

	this.mouseup = function () {
		this._active = false;
	};
}();

module.exports = Pencil;
