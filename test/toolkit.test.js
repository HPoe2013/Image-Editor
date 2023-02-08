/* global describe, it */

const assert = require('assert');
const fs = require('fs');

const toolkit = require('../www/scripts/tools/toolkit.js');

describe('Toolkit', () => {
	it('Has all the tools', () => {
		let toolFiles = fs.readdirSync('./www/scripts/tools');
		let ignoredFiles = ['toolkit', 'tool'];

		toolFiles.forEach(tool => {
			let name = tool.split('.')[0];

			if (ignoredFiles.indexOf(name) != -1 || toolkit[name] != null) 
				return;
			
			assert.fail('Tool was undefined');
		});
	});
});
