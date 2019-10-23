import EditController from './edit-controller';

export default new function () {
	this._welcomePane = null;
	this._editorPane = null;

	this._editor = null;

	this._ready = false;

	let _waitForReady = function (cb) {
		if (this._ready) cb();
		else setTimeout(_waitForReady.bind(this, cb), 100);
	};

	let _isReady = function () {
		return new Promise((resolve, reject) => {
			_waitForReady.call(this, resolve);
		});
	};

	this.init = function () {
		this._welcomePane = document.getElementById('welcome');
		this._editorPane = document.getElementById('editor');

		this._ready = true;
	};

	window.addEventListener('file-open', function (e) {
		_isReady.call(this).then(() => {
			this._welcomePane.classList.add('hidden');
			this._editorPane.classList.remove('hidden');

			console.log('opening', e);

			this._editor = new EditController(this._editorPane, e.detail.isProj, e.detail.file);
		});
	}.bind(this));
}();
