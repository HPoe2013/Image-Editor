// "interface" for the tool objects.
let Tool = function () {
	let _ctor = function (name, params) {
		this._name = name;
		this._params = params != null ? params : {};
	};

	this.getParams = function () {
		return this._params;
	};

	this.mousedown = function () {
		console.log('Tool: ' + this._name + ' does not have mousedown');
	};

	this.mousemove = function () {
		console.log('Tool: ' + this._name + ' does not have mousemove');
	};

	this.mouseup = function () {
		console.log('Tool: ' + this._name + ' does not have mouseup');
	};

	_ctor.apply(this, arguments);
};

module.exports = Tool;
