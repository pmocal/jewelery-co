var Watch = require('../models/watch');
const { check,validationResult, sanitizeBody } = require('express-validator');
var path = require('path');
var nodemailer = require('nodemailer');
var generatePdfBase64 = require('../util/generatePdfBase64');
var ensureAuthentication = require('../util/ensureAuthentication');
var fileUpload = require('../util/fileUpload');
var termsConditionsText = require('../util/termsConditionsText');

exports.watch_all = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		res.render("watch_all", { title: "Watches" });
	}
];

exports.watch_list = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		Watch.find()
			.exec(function(err, list_watches) {
				if (err) {
					return next(err);
				}
				res.render('watch_list', { title: 'Watch List', watch_list: list_watches});
			})
	}
];

//display detail page for a specific author
exports.watch_detail_get = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		Watch.findById(req.params.id)
			.exec(function(err, watch) {
				if (err) {
					return next(err);
				}
				res.render('watch_detail', { title: 'Watch Detail', watch: watch });
			})
	}
];

exports.watch_detail_post = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		// check('emailAddress', 'Estimated retail replacement value must not be empty').isLength({ min: 1 }).trim(),
		// Sanitize fields (using wildcard).
		const docDefinition = {
			content: [
				{
					text: 'Manhattan Gemological Appraisals',
					color: 'royalblue',
					style: 'header'
				},
				{
					text: 'Diamond, High End Watches and Jewelery Experts',
					style: 'subheader'
				},
				{text: '36 West 47th Street\nBooth E07-W07\nNew York, NY 10036\n\nGeneral Info: 212-858-0834'},
				// {
				// 	image: req.body.imageUrl,
				// 	width: 300
				// },
				{
					style: 'tableExample',
					table: {
						body: [
							['Report ID', 'Date', 'Customer Info', 'Brand', 'Reference Number',
							'Serial Number', 'Model', 'Movement', 'Case Diameter'],
							[req.body.id, req.body.date, req.body.customerInfo, req.body.brand, req.body.referenceNumber, req.body.serialNumber,
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
				},
				{text: 'Terms, Conditions & Important Limitations', pageBreak: 'before', style: 'subheader', bold: true},
				termsConditionsText.text
			],
			defaultStyle: {
				font: 'Helvetica',
				alignment: 'justify'
			},
			styles: {
				header: {
					fontSize: 24,
					bold: true
				},
				subheader: {
					fontSize: 18,
					bold: true
				}
			}
		};

		generatePdfBase64.generatePdf(docDefinition, (response) => {
			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'parthiv.alt@gmail.com',
					pass: 'Ra1nermar1ar1lke!'
				}
			});
			
			var mailOptions = {
				from: 'parthiv.alt@gmail.com',
				to: req.body.emailAddress,
				subject: 'Your Watch Appraisal',
				text: 'Your appraisal is attached in a PDF.',
				attachments: [
					{
						path: 'data:application/pdf;base64,' + response.toString('base64')
					}
				]
			};
			
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
			
			res.setHeader('Content-Type', 'application/pdf');
			res.send(response);
		})
	}
];

exports.watch_create_get = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		res.render('watch_form', { title: 'Create watch' });
	}
];

exports.watch_create_post = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	// Validate fields.
	fileUpload.upload.single('file'),
	check('date', 'Date must not be empty.').isLength({ min: 1 }).trim(),
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
	sanitizeBody('date').escape(),
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

		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create a Watch object with escaped and trimmed data.
		var watch = new Watch(
			{
				file: req.file.filename,
			  	date: req.body.date,
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
			}
		);
		
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('watch_form', { title: 'Create Watch', watch: watch, errors: errors.array() });
		} else {
			
			// Data from form is valid. Save watch.
			watch.save(function (err) {
				if (err) { return next(err); }
					//successful - redirect to new watch record.
					res.redirect(watch.url);
				});
		}
	}
];

exports.watch_delete_get = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
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
];

exports.watch_delete_post = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
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
];