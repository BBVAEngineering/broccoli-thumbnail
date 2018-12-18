'use strict';

module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2017
	},
	extends: 'eslint-config-bbva',
	env: {
		node: true
	},
	rules: {
		'callback-return': 0
	},
	overrides: [{
		files: [
			'tests**/*.js'
		],
		env: {
			mocha: true
		},
		rules: {
			'prefer-arrow-callback': 0,
			'no-magic-numbers': 0
		}
	}]
};
