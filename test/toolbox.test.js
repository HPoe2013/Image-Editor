/* global describe, it, beforeEach, afterEach */

const assert = require('assert');
const sinon = require('sinon');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const toolbox = require('../www/scripts/toolbox');

beforeEach(() => {
	global.window = new JSDOM(`
		<div id='toolbar' data-test='1'>
		<div id='tools'data-test='2'>
		<div class='tool-icon'data-test='3'></div>
		<div class='tool-icon active' data-tool='test' data-test='4'></div>
		</div>
		<div id='colors' data-test='5'>
		<input id='main' type='color' value='#000000' />
		</div>
		<div id='tool-params' data-test='6'>
			<div data-prop='test' data-test='7'></div>
		</div>
		</div>
	`).window;
});

describe('Toolbox', () => {
	describe('Init', () => {
		let activateStub = null;
		let handleClickStub = null;

		beforeEach(() => {
			activateStub = sinon.stub(toolbox, '_activateTool');
			handleClickStub = sinon.stub(toolbox, '_handleToolClick');
		});

		afterEach(() => {
			activateStub.restore();
			handleClickStub.restore();
		});

		it('Pulls the data from the DOM.', () => {
			toolbox.init();

			assert.equal(toolbox._toolbox.dataset.test, '2');
			assert.equal(toolbox._colorBox.dataset.test, '5');
			assert.equal(toolbox._toolParamBox.dataset.test, '6');
		});

		it('Activates first tool', () => {
			toolbox.init();

			assert(activateStub.called);
			assert.equal(activateStub.getCall(0).args[0].dataset.test, '3');
		});

		it('Assigns handlers to the tools', () => {
			toolbox.init();
			toolbox._toolbox.querySelector('.tool-icon').click();

			assert(handleClickStub.called);
		});
	});

	describe('getActiveTool', () => {
		it('Gets the active tool.', () => {
			let tool = toolbox.getActiveTool();
			assert.equal(tool, 'test');
		});
	});

	describe('getMainColor', () => {
		it('Gets the current main color', () => {
			let color = toolbox.getMainColor();
			assert.equal(color, '#000000');
		});
	});

	describe('getParamBox', () => {
		let activateStub = null;

		beforeEach(() => {
			activateStub = sinon.stub(toolbox, '_activateTool');
		});

		afterEach(() => {
			activateStub.restore();
		});

		it('Gets the property box', () => {
			toolbox.init();
			let box = toolbox.getParamBox('test');
			assert.equal(box.dataset.test, '7');
		});
	});

	describe('_activateTool', () => {
		let setupStub = null;
		let testEle = null;

		beforeEach(() => {
			setupStub = sinon.stub(toolbox, '_setupParams');
			testEle = {
				classList: {
					add: sinon.stub()
				},
				dataset: {
					tool: 'test'
				}
			};
		});

		afterEach(() => {
			setupStub.restore();
			testEle = null;
		});

		it('Activates the given element', () => {
			toolbox._activateTool(testEle);

			assert(testEle.classList.add.calledOnce);
			assert.equal(testEle.classList.add.getCall(0).args[0], 'active');
		});

		it('Deactivates other tools', () => {
			// Activate with test ele to disable other tools.
			toolbox._activateTool(testEle);

			// Should throw exception due to no active tool.
			assert.throws(toolbox.getActiveTool, TypeError, "Cannot read property 'dataset' of null");
		});

		it('Calls to _setupParams.', () => {
			toolbox._activateTool(testEle);

			assert(setupStub.called);
			assert.equal(setupStub.getCall(0).args[0], 'test');
		});
	});

	describe('_handleToolClick', () => {
		let activateStub = null;

		beforeEach(() => {
			activateStub = sinon.stub(toolbox, '_activateTool');
		});

		afterEach(() => {
			activateStub.restore();
		});

		it('Calls _activateTool', () => {
			let testEvt = {
				target: 'test'
			};

			toolbox._handleToolClick(testEvt);

			assert(activateStub.called);
			assert.equal(activateStub.getCall(0).args[0], 'test');
		});
	});
});
