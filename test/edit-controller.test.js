/* global describe, it, beforeEach, afterEach */

const assert = require('assert');
const sinon = require('sinon');

const PanZoomController = require('../www/scripts/pan-zoom-controller');
const LayerController = require('../www/scripts/layer-controller');
const ActionHandler = require('../www/scripts/action-handler');

const EditController = require('../www/scripts/edit-controller');

describe('EditController', () => {
	describe('Constructor', () => {
		let createStub;
		let openStub;
		let saveStub;

		beforeEach(() => {
			global.window = {
				addEventListener: sinon.stub()
			};

			createStub = sinon.stub(EditController.prototype, '_createFile');
			openStub = sinon.stub(EditController.prototype, '_openFile');
			saveStub = sinon.stub(EditController.prototype, '_saveFile');
		});

		afterEach(() => {
			createStub.restore();
			openStub.restore();
			saveStub.restore();
		});

		it('sets the pane', () => {
			let editController = new EditController('test');
			assert.equal(editController._pane, 'test');
		});

		it('listens for save-file-named', () => {
			let editController = new EditController('test', false, 'x');

			assert(global.window.addEventListener.calledOnce);
			assert.equal(global.window.addEventListener.getCall(0).args[0], 'save-file-named');

			global.window.addEventListener.getCall(0).args[1]();
			assert(saveStub.calledOnce);
		});

		it('opens file if not null', () => {
			let editController = new EditController('test', false, 'x');

			assert(openStub.calledOnce);
			assert(createStub.notCalled);

			assert.equal(openStub.getCall(0).args[0], false);
			assert.equal(openStub.getCall(0).args[1], 'x');
		});

		it('creates file if project without file', () => {
			let editController = new EditController('test', true, null, 'dims');

			assert(createStub.calledOnce);
			assert(openStub.notCalled);

			assert.equal(createStub.getCall(0).args[0], 'dims');
		});
	});

	describe('_createFile', () => {
		let initStub;
		let fakeCanvas = {};

		beforeEach(() => {
			global.window.document.querySelector = sinon.stub();
			global.window.document.querySelector.returns(fakeCanvas);

			global.window.addEventListener = sinon.stub();

			initStub = sinon.stub(EditController.prototype, '_initControllers');
		});

		afterEach(() => {
			initStub.restore();
		});

		it('sets the canvas dimensions', () => {
			let editController = new EditController('pane', true, null, {height: 10, width: 11});

			assert.equal(fakeCanvas.height, 10);
			assert.equal(fakeCanvas.width, 11);
		});

		it('calls to init controllers', () => {
			let editController = new EditController('pane', true, null, {height: 10, width: 11});

			assert(initStub.calledOnce);
			assert.equal(initStub.getCall(0).args[0], 10);
			assert.equal(initStub.getCall(0).args[1], 11);
		});
	});

	describe('_fileOpened', () => {
		let initStub;
		let openStub;

		let fakeContext = null;
		let fakeCanvas = null;

		beforeEach(() => {
			fakeContext = {
				drawImage: sinon.stub()
			};

			fakeCanvas = {
				getContext: sinon.stub()
			};

			global.window.document.querySelector = sinon.stub();
			global.window.document.querySelector.returns(fakeCanvas);

			global.window.addEventListener = sinon.stub();

			fakeCanvas.getContext.returns(fakeContext);

			initStub = sinon.stub(EditController.prototype, '_initControllers');
			openStub = sinon.stub(EditController.prototype, '_openFile');
		});

		afterEach(() => {
			initStub.restore();
			openStub.restore();
		});

		it('assigns image dimensions to canvas', () => {
			let controller = new EditController();
			controller._fileOpened({height: 10, width: 11}, 'test');

			assert.equal(fakeCanvas.height, 10);
			assert.equal(fakeCanvas.width, 11);
		});

		it('draws the image on the canvas at (0,0)', () => {
			let controller = new EditController();
			let fakeImage = {height: 10, width: 11};

			controller._fileOpened(fakeImage, 'test');

			assert(fakeContext.drawImage.calledOnce);
			assert.equal(fakeContext.drawImage.getCall(0).args[0], fakeImage);
			assert.equal(fakeContext.drawImage.getCall(0).args[1], 0);
			assert.equal(fakeContext.drawImage.getCall(0).args[2], 0);
		});

		it('calls to init controllers', () => {
			let controller = new EditController();
			let fakeImage = {height: 10, width: 11};

			controller._fileOpened(fakeImage, 'test');

			assert(initStub.calledOnce);
			assert.equal(initStub.getCall(0).args[0], fakeImage.height);
			assert.equal(initStub.getCall(0).args[1], fakeImage.width);
			assert.equal(initStub.getCall(0).args[2], 'test');
		});
	});

	describe('_initControllers', () => {
		let openStub;

		let fakeContext = null;
		let fakeCanvas = null;

		let pzStub = null;
		let lStub = null;
		let ahStub = null;

		beforeEach(() => {
			pzStub = sinon.stub(PanZoomController.prototype._ctor, 'apply');
			lStub = sinon.stub(LayerController.prototype._ctor, 'apply');
			ahStub = sinon.stub(ActionHandler.prototype._ctor, 'apply');

			fakeContext = {
				drawImage: sinon.stub()
			};

			fakeCanvas = {
				getContext: sinon.stub()
			};

			global.window.document.querySelector = sinon.stub();
			global.window.document.querySelector.returns(fakeCanvas);

			global.window.addEventListener = sinon.stub();

			fakeCanvas.getContext.returns(fakeContext);

			openStub = sinon.stub(EditController.prototype, '_openFile');
		});

		afterEach(() => {
			openStub.restore();

			pzStub.restore();
			lStub.restore();
			ahStub.restore();
		});

		it('initializes controllers', () => {
			let controller = new EditController();
			controller._initControllers();

			assert(pzStub.calledOnce);
			assert(lStub.calledOnce);
			assert(ahStub.calledOnce);
		});
	});
});
