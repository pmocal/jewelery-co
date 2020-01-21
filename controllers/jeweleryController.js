var Jewelery = require('../models/jewelery');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var path = require('path');
var multer  = require('multer')
var upload = multer({ dest: path.join(__dirname, '../public/uploads/') })
const fs = require('fs');
var generatePdfBase64 = require('../util/generatePdfBase64');

exports.jewelery_list = function(req, res, next) {
	Jewelery.find()
		.exec(function(err, list_jewelery) {
			if (err) {
				return next(err);
			}
			res.render('jewelery_list', { title: 'Jewelery List', jewelery_list: list_jewelery });
		})
}

//display detail page for a specific author
exports.jewelery_detail = function(req, res, next) {
	Jewelery.findById(req.params.id)
		.exec(function(err, jewelery) {
			if (err) {
				return next(err);
			}
			res.render('jewelery_detail', { title: 'Jewelery Detail', jewelery: jewelery });
		})
};

exports.jewelery_create_get = function(req, res, next) {
	res.render('jewelery_form', { title: 'Create jewelery' });
};

exports.jewelery_create_post = [
	// Validate fields.
	upload.single('file'),
	check('reportId', 'Report ID must not be empty.').isLength({ min: 1 }).trim(),
	check('date', 'Date must not be empty.').isLength({ min: 1 }).trim(),
	check('customerInfo', 'Customer Information must not be empty.').isLength({ min: 1 }).trim(),
	check('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
	check('stoneType', 'Stone Type must not be empty').isLength({ min: 1 }).trim(),
	check('jeweleryWeight', 'Jewelery Weight must not be empty').isLength({ min: 1 }).trim(),
	check('totalStones', 'Total Stones must not be empty').isLength({ min: 1 }).trim(),
	check('comments', 'Comments must not be empty').isLength({ min: 1 }).trim(),
	check('serialNumber', 'Serial Number must not be empty').isLength({ min: 1 }).trim(),
	check('metalType', 'Metal Type must not be empty').isLength({ min: 1 }).trim(),
	check('caratWeight', 'Carat Weight must not be empty').isLength({ min: 1 }).trim(),
	check('colorGrade', 'Color Grade must not be empty').isLength({ min: 1 }).trim(),
	check('clarityGrade', 'Clarity Grade must not be empty').isLength({ min: 1 }).trim(),
	check('estimatedRetailReplacementValue', 'Estimated retail replacement value must not be empty').isLength({ min: 1 }).trim(),
	// Sanitize fields (using wildcard).
	sanitizeBody('reportId').escape(),
	sanitizeBody('date').escape(),
	sanitizeBody('customerInfo').escape(),
	sanitizeBody('description').escape(),
	sanitizeBody('stoneType').escape(),
	sanitizeBody('jeweleryWeight').escape(),
	sanitizeBody('totalStones').escape(),
	sanitizeBody('comments').escape(),
	sanitizeBody('serialNumber').escape(),
	sanitizeBody('metalType').escape(),
	sanitizeBody('caratWeight').escape(),
	sanitizeBody('colorGrade').escape(),
	sanitizeBody('clarityGrade').escape(),
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

		// Create a Jewelery object with escaped and trimmed data.
		var jewelery = new Jewelery(
			{
				reportId: req.body.reportId,
				date: req.body.date,
				customerInfo: req.body.customerInfo,
				description: req.body.description,
				stoneType: req.body.stoneType,
				jeweleryWeight: req.body.jeweleryWeight,
				totalStones: req.body.totalStones,
				comments: req.body.comments,
				serialNumber: req.body.serialNumber,
				metalType: req.body.metalType,
				caratWeight: req.body.caratWeight,
				colorGrade: req.body.colorGrade,
				clarityGrade: req.body.clarityGrade,
				estimatedRetailReplacementValue: req.body.estimatedRetailReplacementValue,
			}
		);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('jewelery_form', { title: 'Create Jewelery', jewelery: jewelery, errors: errors.array() });
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
								['Report ID', 'Customer Information', 'Description', 'Stone Type',
								'Jewelery Weight', 'Total Stones', 'Comments'],
								[req.body.reportId, req.body.customerInfo, req.body.description, req.body.stoneType,
								req.body.jeweleryWeight, req.body.totalStones, req.body.comments]
							]
						}
					},
					{
						style: 'tableExample',
						table: {
							body: [
								['Serial Number',
								'Metal Type', 'Carat Weight', 'Color Grade', 'Clarity Grade',
								'Estimated Retail Replacement Value'],
								[req.body.serialNumber, req.body.metalType, req.body.caratWeight, req.body.colorGrade,
								req.body.clarityGrade, req.body.estimatedRetailReplacementValue]
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
			// Data from form is valid. Save jewelery.
			jewelery.save(function (err) {
				if (err) { return next(err); }
				//successful - redirect to new watch record.
				generatePdfBase64.generatePdf(docDefinition, (response) => {
					// res.setHeader('Content-Type', 'application/pdf');
					res.send(response);
				})
				// res.redirect(jewelery.url);
			});
		}
	}
];

exports.jewelery_delete_get = function(req, res, next) {
	Jewelery.findById(req.params.id)
		.exec(function(err, jewelery) {
			if (err) {
				return next(err);
			}
			if (jewelery==null) {
				var err = new Error('Jewelery not found');
				err.status = 404;
				return next(err);
			}
			res.render('jewelery_delete', { title: 'Delete Jewelery', jewelery: jewelery });
		})
}

exports.jewelery_delete_post = function(req, res, next) {
	Jewelery.findByIdAndRemove(req.params.id)
		.exec(function(err, jewelery) {
			if (err) {
				return next(err);
			}
			if (jewelery==null) {
				var err = new Error('Jewelery not found');
				err.status = 404;
				return next(err);
			} else{
				Jewelery.findByIdAndRemove(req.params.id, function deleteItem(err) {
					if (err) { return next(err); }
					res.redirect('/jewelery/all');
				})
			}
		})
}