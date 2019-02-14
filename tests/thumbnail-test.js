'use strict';

const path = require('path');
const expect = require('chai').expect;
const testHelpers = require('broccoli-test-helper');
const Funnel = require('broccoli-funnel');
const fs = require('fs-extra');
const sizeOf = require('image-size');
const Thumbnail = require('..');

const createBuilder = testHelpers.createBuilder;
const createTempDir = testHelpers.createTempDir;

describe('broccoli-thumbnail', function() {
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
		expect(Thumbnail).to.exist; // eslint-disable-line
	});

	it('implements "baseDir()"', function() {
		const pluginInstance = new Thumbnail('foo');

		expect(pluginInstance.baseDir).to.be.a('function');
		expect(pluginInstance.baseDir()).to.be.equal(process.cwd());
	});

	it('implements "cacheKeyProcessString()"', function() {
		const pluginInstance = new Thumbnail('foo');

		expect(pluginInstance.cacheKeyProcessString).to.be.a('function');
		expect(pluginInstance.cacheKeyProcessString('a', 'b')).to.be.equal('a35aea60fe097c885568babb48ee7d1e');
	});

	it('links all the existing files', async function() {
		input.write({
			'a.txt': 'a.txt',
			'a.log': 'a.log'
		});
		const tree = new Funnel(input.path());
		const pluginInstance = new Thumbnail(tree);

		output = createBuilder(pluginInstance);

		await output.build();

		expect(Object.keys(output.read())).to.deep.equal(['a.log', 'a.txt', 'thumbnail_troll.jpg']);
	});

	it('generates thumbnails given a prefix', async function() {
		const filename = 'troll.jpg';
		const prefix = 'prefix_';
		const tree = new Funnel(input.path());
		const pluginInstance = new Thumbnail(tree, {
			prefix
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
			extensions: ['jpg'],
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
