export default function () {
	this._frame = null;
	this._activeLayer = null;

	this._nextInd = 1;

	let _ctor = function (frame, data) {
		this._frame = frame;

		this._activeLayer = this._frame.querySelector('.layer:last-of-type');

		this._controls = this._frame.parentNode.querySelector('#layer-controls');

		this._controls.querySelector('#add-layer').addEventListener('click', _addLayer.bind(this));

		this._activeLayer.style.zIndex = 0;

		let index = this._activeLayer.dataset.index;

		let displayLayers = this._controls.querySelectorAll('.disp-layer');

		let activeDisp = Array.prototype.find.call(displayLayers, (layer) => {
			return layer.dataset.linked === index;
		});

		activeDisp.classList.add('active');
		activeDisp.addEventListener('click', _setActiveLayer.bind(this, this._activeLayer));

		if (Array.isArray(data)) {
			for (let i = 1; i < data.length; i++) {
				_addLayer.call(this, data[i])
			};
		}
	};

	let _addLayer = function (img) {
		let newCanvas = document.createElement('canvas');
		newCanvas.classList.add('layer');
		newCanvas.dataset.index = this._nextInd;
		newCanvas.height = this._activeLayer.height;
		newCanvas.width = this._activeLayer.width;

		newCanvas.style.transform = this._activeLayer.style.transform;
		newCanvas.style.zIndex = this._nextInd;

		if (img != null && img instanceof HTMLImageElement) {
			newCanvas.getContext('2d').drawImage(img, 0, 0);
		}

		let newLayer = document.createElement('div');
		newLayer.classList.add('disp-layer');
		newLayer.dataset.linked = this._nextInd;

		newLayer.addEventListener('click', _setActiveLayer.bind(this, newCanvas));

		this._frame.prepend(newCanvas);
		this._controls.querySelector('#layer-display').prepend(newLayer);

		_setActiveLayer.call(this, newCanvas);

		this._nextInd++;
	};

	let _setActiveLayer = function (layer) {
		this._activeLayer = layer;

		let active = this._controls.querySelector('.disp-layer.active');
		if (active != null) active.classList.remove('active');

		let index = this._activeLayer.dataset.index;

		let displayLayers = this._controls.querySelectorAll('.disp-layer');

		let activeDisp = Array.prototype.find.call(displayLayers, (dispLayer) => {
			return dispLayer.dataset.linked === index;
		});

		activeDisp.classList.add('active');
	};

	this.getActiveCanvas = function () {
		return this._activeLayer;
	};

	_ctor.apply(this, arguments);
};
