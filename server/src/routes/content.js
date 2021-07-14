const express = require('express');
const getPath = require('../lib/getPath');
const fs = require('fs');
const path = require('path');
const { getContent } = require('../lib/helpers');
const router = express.Router();

// Get all the content in the path of cloud folder
router.get('/:path?', async (req, res, next) => {

	try {
		var paths = getPath('/');

		// If client requests a folder path with hyphens inside the root
		if (req.params.path) {
			paths = getPath('/' + req.params.path);

			// Checking if dir exists
			console.log('Cheking access to dir', paths.relativePath);
			await fs.access(paths.absolutePath, (err) => {
				if (err) {
					res.status(400).end();
				}
			});
			// if (!fs.lstatSync(paths.absolutePath).isDirectory()) {
			// 	console.log('ERROR: Directory does not exist');
			// 	process.exitCode(404);
			// }
		}
		// console.log(paths);

		var content = getContent(paths);

		res.json({
			content,
			success: true
		});

	} catch(err) {
		next(err);
	}
});

router.delete('/delete/:path', async (req, res) => {

	const path = getPath('/' + req.params.path);
	// console.log(path);

	// Check if exists such path
	if (fs.existsSync(path.absolutePath)) {
		if (fs.lstatSync(path.absolutePath).isFile()) {
			// DELETE for files
			await fs.unlink(path.absolutePath, (err) => {
				if (err) throw err;
				res.json({
					path_deleted: path.relativePath,
					message: 'File deleted successfully',
					success: true
				});
			});
		} else {
			// DELETE for folders
			await fs.rmdir(path.absolutePath, { recursive: true }, (err) => {
				if (err) throw err;
				res.json({
					path_deleted: path.relativePath,
					message: 'Folder deleted successfully',
					success: true
				});
			})
		}
	} else {
		res.status(400).json({
			message: 'File or folder does not exist',
			success: false
		});
	}
});

module.exports = router;