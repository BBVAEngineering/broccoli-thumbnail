'use strict';

const Filter = require('broccoli-persistent-filter');
const md5Hex = require('broccoli-persistent-filter/lib/md5-hex');
const path = require('path');
const sharp = require('sharp');

class Thumbnail extends Filter {
	constructor(inputNode, options = {}) {
		super(inputNode, {
			outputEncoding: null,
			persist: options.persist,
			annotation: 'Thumbnail',
			'async': true // eslint-disable-line
		});

		this.options = Object.assign({
			prefix: 'thumbnail_',
			extensions: ['jpg', 'jpeg', 'gif', 'png'],
			width: 64
		}, options);
	}

	baseDir() {
		return path.join(__dirname, '..');
	}

	getDestFilePath(relativePath) {
		const { extensions, prefix } = this.options;
		const ext = path.extname(relativePath).replace(/^\./, '');

		if (extensions.includes(ext)) {
			const basename = path.basename(relativePath);
			const dirname = path.dirname(relativePath);
			const thumbnailRelativePath = path.join(dirname, `${prefix}${basename}`);

			return thumbnailRelativePath;
		}

		return null;
	}

	cacheKeyProcessString(string, relativePath) {
		return md5Hex(string.length + 0x00 + relativePath);
	}

	async processString(content, relativePath) {
		const { width } = this.options;
		const absolutePath = path.resolve(this.inputPaths[0], relativePath);
		const image = sharp(absolutePath);
		const metadata = await image.metadata();
		const height = parseInt(metadata.height * width / metadata.width, 10);
		const output = await image
			.resize(width, height)
			.toBuffer();

		return { output };
	}

	postProcess(results) {
		return { output: results.output };
	}
}

module.exports = Thumbnail;
