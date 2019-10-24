export default new function () {
	this._toolbox = null;
	this._colorBox = null;

	let _activateTool = function (selTool) {
		let activeTools = this._toolbox.querySelectorAll('.active');
		Array.prototype.forEach.call(activeTools, (tool) => {
			tool.classList.remove('active');
		});

		selTool.classList.add('active');
	};

	let _handleToolClick = function (e) {
		_activateTool.call(this, e.target);
	};

	this.init = function () {
		this._toolbox = document.querySelector('#toolbar #tools');
		this._colorBox = document.querySelector('#toolbar #colors');

		let tools = this._toolbox.querySelectorAll('.tool-icon');
		Array.prototype.forEach.call(tools, (tool) => {
			tool.addEventListener('click', _handleToolClick.bind(this));
		});

		_activateTool.call(this, tools[0]);
	};

	this.getActiveTool = function () {
		let active = this._toolbox.querySelector('.active');
		return active.dataset.tool;
	};

	this.getMainColor = function () {
		return this._colorBox.querySelector('#main').value;
	};
}();
