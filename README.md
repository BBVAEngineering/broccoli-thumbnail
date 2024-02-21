# DEPRECATED

# broccoli-thumbnail

[![Build Status](https://travis-ci.org/BBVAEngineering/broccoli-thumbnail.svg?branch=master)](https://travis-ci.org/BBVAEngineering/broccoli-thumbnail)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fbroccoli-thumbnail.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fbroccoli-thumbnail)
[![NPM version](https://badge.fury.io/js/broccoli-thumbnail.svg)](https://badge.fury.io/js/broccoli-thumbnail)
[![Dependency Status](https://david-dm.org/BBVAEngineering/broccoli-thumbnail.svg)](https://david-dm.org/BBVAEngineering/broccoli-thumbnail)
[![codecov](https://codecov.io/gh/BBVAEngineering/broccoli-thumbnail/branch/master/graph/badge.svg)](https://codecov.io/gh/BBVAEngineering/broccoli-thumbnail)
[![Greenkeeper badge](https://badges.greenkeeper.io/BBVAEngineering/broccoli-thumbnail.svg)](https://greenkeeper.io/)

## Information

[![NPM](https://nodei.co/npm/broccoli-thumbnail.png?downloads=true&downloadRank=true)](https://nodei.co/npm/broccoli-thumbnail/)

Copy and resizes images given an input tree.

**Why?** For example, to generate a low quality copy of each image and improve the page speed when loading.

## Installation & usage

`npm install --save broccoli-thumbnail`


```javascript
// Raw
const Thumbnail = require('broccoli-thumbnail');

const myTree = new Funnel('assets/images');
const thumbnailTree = new Thumbnail(myTree, {
  width: 128,
  prefix: 'small-'
});
```

```javascript
// Ember addon style
const Thumbnail = require('broccoli-thumbnail');

module.exports = {
  // ...

  treeForPublic() {
    return new Thumbnail('assets/images', { /* options */ });
  }
};
```

## Options

| Option     | Type      | Defaults                        | Description                               |
|------------|-----------|---------------------------------|-------------------------------------------|
| prefix     | `String`  | `thumbnail_`                    | Prefix to be added on each thumbnail name |
| extensions | `Array`   | `['jpg', 'jpeg', 'gif', 'png']` | Files to be processed                     |
| persist    | `Boolean` | `false`                         | Use disk cache                            |
| width      | `Number`  | `64`                            | Thumbnail width                           |

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BBVAEngineering/broccoli-thumbnail/tags).

## Authors

See the list of [contributors](https://github.com/BBVAEngineering/broccoli-thumbnail/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
