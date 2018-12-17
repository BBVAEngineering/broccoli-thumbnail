'use strict';
/* eslint-env mocha */
/* eslint-disable prefer-arrow-callback */

const path = require('path');
const expect = require('chai').expect;
const testHelpers = require('broccoli-test-helper');
const Funnel = require('broccoli-funnel');
const fs = require('fs-extra');
const sizeOf = require('image-size');
const Thumbnail = require('..');

const createBuilder = testHelpers.createBuilder;
const createTempDir = testHelpers.createTempDir;

describe('broccoli-lint-remark', function() {
	let input, output;

	beforeEach(async function() {
		this.timeout(60000);
		input = await createTempDir();
		input.writeBinary('troll.jpg', await fs.readFile(path.resolve(__dirname, 'assets', 'troll.jpg')));
	});

	afterEach(async function() {
		await input.dispose();

		if (output) {
			await output.dispose();
		}
	});

	it('exists', function() {
		expect(Thumbnail).to.exist;
	});

	it('links all the existing files', async function() {
		input.write({
			'a.txt': 'a.txt',
			'a.log': 'a.log'
		});
		const tree = new Funnel(input.path());
		const pluginInstance = new Thumbnail(tree, { globs: [] });

		output = createBuilder(pluginInstance);

		await output.build();

		expect(Object.keys(output.read())).to.deep.equal(['a.log', 'a.txt', 'troll.jpg']);
	});

	it('generates thumbnails given a prefix and a glob', async function() {
		const filename = 'troll.jpg';
		const prefix = 'prefix_';
		const tree = new Funnel(input.path());
		const pluginInstance = new Thumbnail(tree, {
			prefix,
			globs: [filename]
		});

		output = createBuilder(pluginInstance);

		await output.build();

		expect(Object.keys(output.read())).to.include(`${prefix}${filename}`);
	});

	it('generates thumbnails given a width', async function() {
		const filename = 'troll.jpg';
		const prefix = 'prefix_';
		const width = 60;
		const tree = new Funnel(input.path());
		const pluginInstance = new Thumbnail(tree, {
			prefix,
			globs: [filename],
			width
		});

		output = createBuilder(pluginInstance);

		await output.build();

		const thumbnailPath = path.resolve(output.dir, `${prefix}${filename}`);
		const dimensions = sizeOf(thumbnailPath);

		expect(dimensions).to.deep.include({
			width,
			height: 54
		});
	});
});
