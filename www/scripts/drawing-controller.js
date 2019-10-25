export default new function () {
	/**
	 * Draws a line on the given canvas using the given data.
	 * @param  {Canvas} canvas The canvas to which to draw.
	 * @param  {JSON} point1 The start point of the line
	 * @param  {JSON} point2 The end point of the line.
	 * @param  {String} color  The color of the line.
	 */
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

	/**
	 * Erases a line on the given canvas using the given data.
	 * @param  {Canvas} canvas The canvas from which to erase.
	 * @param  {JSON} point1 The start point of the line
	 * @param  {JSON} point2 The end point of the line.
	 */
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
