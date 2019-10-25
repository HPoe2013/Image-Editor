/** Class to handle the toolbar on the front end. */
export default new function () {
	this._toolbox = null;	// DOM Node housing the tool selection.
	this._colorBox = null;	// DOM Node housing color selection.

	/**
	 * Function to select a tool for use.
	 * @param  {DOM Node} selTool The node for the selected tool
	 */
	let _activateTool = function (selTool) {
		let activeTools = this._toolbox.querySelectorAll('.active');
		Array.prototype.forEach.call(activeTools, (tool) => {
			tool.classList.remove('active');
		});

		selTool.classList.add('active');
	};

	/**
	 * Handler for when a tool is clicked.
	 * @param  {Event} e The triggering event.
	 */
	let _handleToolClick = function (e) {
		_activateTool.call(this, e.target);
	};

	/** Initialization function to set up toolbar. */
	this.init = function () {
		this._toolbox = document.querySelector('#toolbar #tools');
		this._colorBox = document.querySelector('#toolbar #colors');

		let tools = this._toolbox.querySelectorAll('.tool-icon');
		Array.prototype.forEach.call(tools, (tool) => {
			tool.addEventListener('click', _handleToolClick.bind(this));
		});

		_activateTool.call(this, tools[0]);
	};

	/**
	 * Gets the currently active tool
	 * @return {String} String denoting the active tool
	 */
	this.getActiveTool = function () {
		let active = this._toolbox.querySelector('.active');
		return active.dataset.tool;
	};

	/**
	 * Gets the main color from the color selector.
	 * @return {String} A string denoting the current main color.
	 */
	this.getMainColor = function () {
		return this._colorBox.querySelector('#main').value;
	};
}();
