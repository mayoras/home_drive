const storage = require('./storage');
const path = require('path');

const getPath = (p) => {

	p = p.split('--').join('/');

	var paths = {
		relativePath: p,
		absolutePath: path.join(storage, p)
	}
	return paths;
}

module.exports = getPath;