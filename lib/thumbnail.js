'use strict';

const Plugin = require('broccoli-caching-writer');
const path = require('path');
const fs = require('fs-extra');
const walkSync = require('walk-sync');
const sharp = require('sharp');

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

class Thumbnail extends Plugin {
	constructor(inputNode, options = {}) {
		options = Object.assign({
			prefix: 'thumbnail_',
			globs: [
				'**/*.{jpg,jpeg,gif,png}'
			],
			width: 64
		}, options);

		super([inputNode], options);
		this.options = options;
	}

	async build() {
		const { globs, prefix, width } = this.options;
		const inputPath = this.inputPaths[0];
		const allInputFiles = walkSync(inputPath, { directories: false });
		const images = walkSync(inputPath, { directories: false, globs });

		await asyncForEach(images, async(relativePath) => {
			const absolutePath = path.join(inputPath, relativePath);
			const basename = path.basename(relativePath);
			const dirname = path.dirname(relativePath);
			const thumbnailRelativePath = path.join(dirname, `${prefix}${basename}`);
			const image = sharp(absolutePath);

			await fs.ensureDir(path.join(this.outputPath, dirname));

			const metadata = await image.metadata();
			const height = parseInt(metadata.height * width / metadata.width, 10);

			await image
				.resize(width, height)
				.toFile(path.join(this.outputPath, thumbnailRelativePath));
		});

		await asyncForEach(allInputFiles, async(relativePath) => {
			const absolutePath = path.join(inputPath, relativePath);
			const outputPath = path.join(this.outputPath, relativePath);

			await fs.ensureLink(absolutePath, outputPath);
		});
	}
}

module.exports = Thumbnail;
