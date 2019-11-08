const ToolKit = require('./tools/toolkit');

/** Class to handle the toolbar on the front end. */
module.exports = new function () {
	this._toolbox = null;	// DOM Node housing the tool selection.
	this._colorBox = null;	// DOM Node housing color selection.

	/**
	 * Function to select a tool for use.
	 * @param  {DOM Node} selTool The node for the selected tool
	 */
	this._activateTool = function (selTool) {
		// TODO: Save current param settings in order to reload them on tool selection?

		let activeTools = this._toolbox.querySelectorAll('.active');

		Array.prototype.forEach.call(activeTools, (tool) => {
			tool.classList.remove('active');
		});

		selTool.classList.add('active');

		this._setupParams(selTool.dataset.tool);
	};

	/**
	 * Handler for when a tool is clicked.
	 * @param  {Event} e The triggering event.
	 */
	this._handleToolClick = function (e) {
		this._activateTool(e.target);
	};

	this._setupParams = function (tool) {
		this._currToolParams = ToolKit[tool].params;

		if (this._currToolParams == null) {
			this._toolParamBox.classList.add('hidden');
			return;
		}

		this._toolParamBox.classList.remove('hidden');

		let props = this._toolParamBox.querySelectorAll('.prop');
		Array.prototype.forEach.call(props, prop => {
			if (this._currToolParams[prop.dataset.prop] != null) {
				prop.classList.remove('hidden');

				let pData = this._currToolParams[prop.dataset.prop];
				pData.init.call(this, prop, pData);
			} else prop.classList.add('hidden');
		});
	};

	/** Initialization function to set up toolbar. */
	this.init = function () {
		this._toolbox = window.document.querySelector('#toolbar #tools');
		this._colorBox = window.document.querySelector('#toolbar #colors');
		this._toolParamBox = window.document.querySelector('#toolbar #tool-params');

		this._toolbox.parentNode.classList.remove('hidden');

		let tools = this._toolbox.querySelectorAll('.tool-icon');
		Array.prototype.forEach.call(tools, (tool) => {
			tool.addEventListener('click', this._handleToolClick.bind(this));
		});

		this._activateTool(tools[0]);
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

	this.getParamBox = function (prop) {
		return this._toolParamBox.querySelector('[data-prop="' + prop + '"]');
	};
}();
