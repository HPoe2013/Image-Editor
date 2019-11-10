/* global describe, it */

const assert = require('assert');
const fs = require('fs');

const toolkit = require('../www/scripts/tools/toolkit.js');

describe('Toolkit', () => {
	it('Has all the tools', () => {
		let toolFiles = fs.readdirSync('./www/scripts/tools');

		toolFiles.forEach(tool => {
			let name = tool.split('.')[0];

			if (name === 'toolkit') return;

			if (toolkit[name] == null) assert.fail(toolkit[name], name, 'Tool was undefined');
		});
	});
});
