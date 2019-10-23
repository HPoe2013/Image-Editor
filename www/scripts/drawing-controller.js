export default new function () {
	this.drawLine = function (canvas, dim1, dim2, color) {
		let context = canvas.getContext('2d');
		context.moveTo(dim1.x, dim1.y);
		context.lineTo(dim2.x, dim2.y);

		context.strokeStyle = color;

		context.stroke();
	};
}();
