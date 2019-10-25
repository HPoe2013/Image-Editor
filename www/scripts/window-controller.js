import EditController from './edit-controller';
import Toolbox from './toolbox';

/** Class to control the window related functions and drive the app. */
export default new function () {
	this._welcomePane = null;	// DOM element containing the "welcome" page.
	this._editorPane = null;	// DOM element containing the first "editor" panel.

	this._editor = null;		// Reference to the edit controller.

	this._ready = false;		// Boolean to denote whether or not the loading has completed.

	/**
	 * Helper function to wait for the class to be ready.
	 * @param  {Function} cb Function to call when class is ready.
	 */
	let _waitForReady = function (cb) {
		if (this._ready) cb();
		else setTimeout(_waitForReady.bind(this, cb), 100);
	};

	/**
	 * Function to promise that loading will complete.
	 * @return {Promise} Promise that will resolve when class is ready.
	 */
	let _isReady = function () {
		return new Promise((resolve, reject) => {
			_waitForReady.call(this, resolve);
		});
	};

	/** Initialization function to get the panes and ready up. */
	this.init = function () {
		this._welcomePane = document.getElementById('welcome');
		this._editorPane = document.getElementById('editor');

		this._ready = true;
	};

	/** Listener for file open event from middleware. */
	window.addEventListener('file-open', function (e) {
		_isReady.call(this).then(() => {
			this._welcomePane.classList.add('hidden');
			this._editorPane.classList.remove('hidden');
			this._editor = new EditController(this._editorPane, e.detail.isProj, e.detail.file);
			Toolbox.init();
		});
	}.bind(this));

	/** Listener for new file event from middleware. */
	window.addEventListener('new-file', function (e) {
		_isReady.call(this).then(() => {
			this._welcomePane.classList.add('hidden');
			this._editorPane.classList.remove('hidden');

			this._editor = new EditController(this._editorPane, true, null, e.detail);
			Toolbox.init();
		});
	}.bind(this));
}();
