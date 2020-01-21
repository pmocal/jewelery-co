var Watch = require('../models/watch');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var path = require('path');
var multer  = require('multer')
var upload = multer({ dest: path.join(__dirname, '../public/uploads/') })
const fs = require('fs');
var generatePdfBase64 = require('../util/generatePdfBase64');

exports.watch_list = function(req, res, next) {
	Watch.find()
		.exec(function(err, list_watches) {
			if (err) {
				return next(err);
			}
			res.render('watch_list', { title: 'Watch List', watch_list: list_watches});
		})
}

//display detail page for a specific author
exports.watch_detail = function(req, res, next) {
	Watch.findById(req.params.id)
		.exec(function(err, watch) {
			if (err) {
				return next(err);
			}
			res.render('watch_detail', { title: 'Watch Detail', watch: watch });
		})
};

exports.watch_create_get = function(req, res, next) {
	res.render('watch_form', { title: 'Create watch' });
};

exports.watch_create_post = [
	// Validate fields.
	upload.single('file'),
	check('reportId', 'Report ID must not be empty.').isLength({ min: 1 }).trim(),
	check('customerInfo', 'Customer Information must not be empty.').isLength({ min: 1 }).trim(),
	check('brand', 'Brand must not be empty.').isLength({ min: 1 }).trim(),
	check('referenceNumber', 'Reference Number must not be empty').isLength({ min: 1 }).trim(),
	check('serialNumber', 'Serial Number must not be empty').isLength({ min: 1 }).trim(),
	check('model', 'Model must not be empty').isLength({ min: 1 }).trim(),
	check('movement', 'Movement must not be empty').isLength({ min: 1 }).trim(),
	check('caseDiameter', 'Case Diameter must not be empty').isLength({ min: 1 }).trim(),
	check('bezelMaterial', 'Bezel Material must not be empty').isLength({ min: 1 }).trim(),
	check('dial', 'Dial must not be empty').isLength({ min: 1 }).trim(),
	check('braceletMaterial', 'Bracelet Material must not be empty').isLength({ min: 1 }).trim(),
	check('comments', 'Comments must not be empty').isLength({ min: 1 }).trim(),
	check('claspMaterial', 'Clasp Material must not be empty').isLength({ min: 1 }).trim(),
	check('functions', 'Functions must not be empty').isLength({ min: 1 }).trim(),
	check('year', 'Year must not be empty').isLength({ min: 1 }).trim(),
	check('condition', 'Condition must not be empty').isLength({ min: 1 }).trim(),
	check('estimatedRetailReplacementValue', 'Estimated Retail Replacement Value must not be empty').isLength({ min: 1 }).trim(),
	// Sanitize fields (using wildcard).
	sanitizeBody('reportId').escape(),
	sanitizeBody('customerInfo').escape(),
	sanitizeBody('brand').escape(),
	sanitizeBody('referenceNumber').escape(),
	sanitizeBody('serialNumber').escape(),
	sanitizeBody('model').escape(),
	sanitizeBody('movement').escape(),
	sanitizeBody('caseDiameter').escape(),
	sanitizeBody('bezelMaterial').escape(),
	sanitizeBody('dial').escape(),
	sanitizeBody('braceletMaterial').escape(),
	sanitizeBody('comments').escape(),
	sanitizeBody('claspMaterial').escape(),
	sanitizeBody('functions').escape(),
	sanitizeBody('year').escape(),
	sanitizeBody('condition').escape(),
	sanitizeBody('estimatedRetailReplacementValue').escape(),
	// Process request after validation and sanitization.
	(req, res, next) => {

		if (req.file != null) {
			const tempPath = req.file.path;
			var fileEnding = tempPath.match(/\.[0-9a-z]{1,5}$/i);
			var targetPath;
			if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
				targetPath = path.join(__dirname, "../public/uploads/" + req.body.reportId + ".jpg");
				fs.rename(tempPath, targetPath, err => {
					if (err) return next(err);
			  	});
			} else {
				fs.unlink(tempPath, err => {
					if (err) return next(err);
					res.status(403)
						.contentType("text/plain")
						.end("Only .jpg files are allowed!");
				});
			}
		}

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Watch object with escaped and trimmed data.
		var watch = new Watch(
		  { reportId: req.body.reportId,
			customerInfo: req.body.customerInfo,
			brand: req.body.brand,
			referenceNumber: req.body.referenceNumber,
			serialNumber: req.body.serialNumber,
			model: req.body.model,
			movement: req.body.movement,
			caseDiameter: req.body.caseDiameter,
			bezelMaterial: req.body.bezelMaterial,
			dial: req.body.dial,
			braceletMaterial: req.body.braceletMaterial,
			comments: req.body.comments,
			claspMaterial: req.body.claspMaterial,
			functions: req.body.functions,
			year: req.body.year,
			condition: req.body.condition,
			estimatedRetailReplacementValue: req.body.estimatedRetailReplacementValue
		   });

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('watch_form', { title: 'Create Watch', watch: watch, errors: errors.array() });
		}
		else {
			targetPath = path.join(__dirname, "../public/uploads/" + req.body.reportId + ".jpg");
			const docDefinition = {
				content: [
					{
						image: targetPath,
						width: 450
					},
					{
						text: 'Manhattan Gemological Appraisals',
						color: 'blue',
						style: 'header'
					},
					{
						style: 'tableExample',
						table: {
							body: [
								['Report ID', 'Customer Info', 'Brand', 'Reference Number', 'Serial Number', 'Model', 'Movement',
								'Case Diameter'],
								[req.body.reportId, req.body.customerInfo, req.body.brand, req.body.referenceNumber, req.body.serialNumber,
								req.body.model, req.body.movement, req.body.caseDiameter]
							]
						}
					},
					{
						style: 'tableExample',
						table: {
							body: [
								['Bezel Material', 'Dial', 'Bracelet Material', 'Comments', 'Clasp Material',
								'Functions'],
								[req.body.bezelMaterial, req.body.dial,
								req.body.braceletMaterial, req.body.comments, req.body.claspMaterial, req.body.functions]
							]
						}
					},
					{
						style: 'tableExample',
						table: {
							body: [
								['Year', 'Condition', 'Estimated Retail Replacement Value'],
								[req.body.year, req.body.condition, req.body.estimatedRetailReplacementValue]
							]
						}
					}
				],
				defaultStyle: {
					font: 'Courier'
				},
				styles: {
					header: {
						fontSize: 18,
						bold: true
					}
				}
			};
			generatePdfBase64.generatePdf(docDefinition, (response) => {
				// res.setHeader('Content-Type', 'application/pdf');
				watch.pdfString = response;
			})
			// Data from form is valid. Save watch.
			watch.save(function (err) {
				if (err) { return next(err); }
					//successful - redirect to new watch record.
					
					res.redirect(watch.url);
				});
		}
	}
];

exports.watch_delete_get = function(req, res, next) {
	Watch.findById(req.params.id)
		.exec(function(err, watch) {
			if (err) {
				return next(err);
			}
			if (watch==null) {
				var err = new Error('Watch not found');
				err.status = 404;
				return next(err);
			}
			res.render('watch_delete', { title: 'Delete Watch', watch: watch });
		})
}

exports.watch_delete_post = function(req, res, next) {
	Watch.findByIdAndRemove(req.params.id)
		.exec(function(err, watch) {
			if (err) {
				return next(err);
			}
			if (watch==null) {
				var err = new Error('Watch not found');
				err.status = 404;
				return next(err);
			} else{
				Watch.findByIdAndRemove(req.params.id, function deleteItem(err) {
					if (err) { return next(err); }
					res.redirect('/watches/all');
				})
			}
		})
}