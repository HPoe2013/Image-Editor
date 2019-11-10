/* global describe, it, beforeEach, afterEach */

const assert = require('assert');
const sinon = require('sinon');

const DrawingController = require('../www/scripts/drawing-controller');

describe('DrawingController', () => {
	let canvas = null;
	let context = null;
	beforeEach(() => {
		canvas = {
			getContext: sinon.stub()
		};

		context = {
			beginPath: sinon.stub(),
			moveTo: sinon.stub(),
			lineTo: sinon.stub(),
			stroke: sinon.stub(),
			fill: sinon.stub(),
			closePath: sinon.stub()
		};
		canvas.getContext.returns(context);
	});

	afterEach(() => {
		canvas = null;
		context = null;
	});

	describe('drawLine', () => {
		it('gets the context from the canvas', () => {
			DrawingController.drawLine(canvas, {x: 1, y: 1}, {x: 2, y: 2}, 'color', 'width');

			assert(canvas.getContext.calledOnce);
			assert.equal(canvas.getContext.getCall(0).args[0], '2d');
		});

		it('sets the composite operation correctly', () => {
			DrawingController.drawLine(canvas, {x: 1, y: 1}, {x: 2, y: 2}, 'color', 'width');

			assert.equal(context.globalCompositeOperation, 'source-over');
		});

		it('opens and closes the path itself', () => {
			DrawingController.drawLine(canvas, {x: 1, y: 1}, {x: 2, y: 2}, 'color', 'width');

			assert(context.beginPath.called);
			assert(context.closePath.called);
		});

		it('moves to the first point and draws to the second', () => {
			DrawingController.drawLine(canvas, {x: 1, y: 2}, {x: 3, y: 4}, 'color', 'width');

			assert(context.moveTo.calledOnce);
			assert.equal(context.moveTo.getCall(0).args[0], 1);
			assert.equal(context.moveTo.getCall(0).args[1], 2);

			assert(context.lineTo.calledOnce);
			assert.equal(context.lineTo.getCall(0).args[0], 3);
			assert.equal(context.lineTo.getCall(0).args[1], 4);
		});

		it('colors the line', () => {
			DrawingController.drawLine(canvas, {x: 1, y: 2}, {x: 3, y: 4}, 'color', 'width');

			assert.equal(context.strokeStyle, 'color');
			assert.equal(context.fillStyle, 'color');

			assert(context.stroke.called);
			assert(context.fill.called);
		});

		it('sets the stroke width', () => {
			DrawingController.drawLine(canvas, {x: 1, y: 2}, {x: 3, y: 4}, 'color', 'width');

			assert.equal(context.lineWidth, 'width');
		});
	});

	describe('eraseLine', () => {
		it('gets the context from the canvas', () => {
			DrawingController.eraseLine(canvas, {x: 1, y: 1}, {x: 2, y: 2}, 'width');

			assert(canvas.getContext.calledOnce);
			assert.equal(canvas.getContext.getCall(0).args[0], '2d');
		});

		it('sets the composite operation correctly', () => {
			DrawingController.eraseLine(canvas, {x: 1, y: 1}, {x: 2, y: 2}, 'width');

			assert.equal(context.globalCompositeOperation, 'destination-out');
		});

		it('opens and closes the path itself', () => {
			DrawingController.eraseLine(canvas, {x: 1, y: 1}, {x: 2, y: 2}, 'width');

			assert(context.beginPath.called);
			assert(context.closePath.called);
		});

		it('moves to the first point and draws to the second', () => {
			DrawingController.eraseLine(canvas, {x: 1, y: 2}, {x: 3, y: 4}, 'width');

			assert(context.moveTo.calledOnce);
			assert.equal(context.moveTo.getCall(0).args[0], 1);
			assert.equal(context.moveTo.getCall(0).args[1], 2);

			assert(context.lineTo.calledOnce);
			assert.equal(context.lineTo.getCall(0).args[0], 3);
			assert.equal(context.lineTo.getCall(0).args[1], 4);
		});

		it('sets the stroke width', () => {
			DrawingController.eraseLine(canvas, {x: 1, y: 2}, {x: 3, y: 4}, 'width');

			assert.equal(context.lineWidth, 'width');
		});
	});
});
