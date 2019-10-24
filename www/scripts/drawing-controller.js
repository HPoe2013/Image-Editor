export default new function () {
	this.drawLine = function (canvas, point1, point2, color) {
		let context = canvas.getContext('2d');
		context.globalCompositeOperation = 'source-over';

		context.beginPath();

		context.moveTo(point1.x, point1.y);
		context.lineTo(point2.x, point2.y);

		context.strokeStyle = color;
		context.stroke();

		context.fillStyle = color;
		context.fill();

		context.closePath();
	};

	this.eraseLine = function (canvas, point1, point2) {
		let context = canvas.getContext('2d');
		context.globalCompositeOperation = 'destination-out';

		context.beginPath();

		context.moveTo(point1.x, point1.y);
		context.lineTo(point2.x, point2.y);

		context.strokeStyle = 'rgba(0, 0, 0, 1)';
		context.stroke();

		context.fillStyle = 'rgba(0, 0, 0, 1)';
		context.fill();

		context.closePath();
	};
}();
