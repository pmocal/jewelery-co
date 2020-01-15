var Jewelery = require('../models/jewelery');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var path = require('path');

exports.jewelery_list = function(req, res, next) {
	Jewelery.find()
		.exec(function(err, list_jewelery) {
			if (err) {
				return next(err);
			}
			res.render('jewelery_list', { title: 'Jewelery List', jewelery_list: list_jewelery});
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
	check('reportId', 'Report ID must not be empty.').isLength({ min: 1 }).trim(),
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
	// Process request after validation and sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Jewelery object with escaped and trimmed data.
		var jewelery = new Jewelery(
			{
				reportId: req.body.reportId,
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
			// Data from form is valid. Save jewelery.
			jewelery.save(function (err) {
				if (err) { return next(err); }
					//successful - redirect to new jewelery record.
					res.redirect(jewelery.url);
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
			res.render('jewelery_delete', { title: 'Jewelery Delete', jewelery: jewelery });
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
					res.redirect('/jewelery');
				})
			}
		})
}

exports.jewelery_update_get = function(req, res, next) {
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
			res.render('jewelery_form', { title: 'Update Jewelery', jewelery: jewelery });
		})
}

exports.jewelery_update_post = [
	check('reportId', 'Report ID must not be empty.').isLength({ min: 1 }).trim(),
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
	// Process request after validation and sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Jewelery object with escaped and trimmed data.
		var jewelery = new Jewelery(
			{
				reportId: req.body.reportId,
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
			// Data from form is valid. Save jewelery.
			Jewelery.findByIdAndUpdate(req.params.id, jewelery, {}, function (err, thejewelery) {
				if (err) { return next(err); }
					//successful - redirect to new jewelery record.
					res.redirect(thejewelery.url);
				});
		}
	}
];