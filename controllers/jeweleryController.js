var Jewelery = require('../models/jewelery');
const { check,validationResult, sanitizeBody } = require('express-validator');
var path = require('path');
var nodemailer = require('nodemailer');
var generatePdfBase64 = require('../util/generatePdfBase64');
var ensureAuthentication = require('../util/ensureAuthentication');
var fileUpload = require('../util/fileUpload');
var termsConditionsText = require('../util/termsConditionsText');
const fetch = require("node-fetch");

exports.jewelery_all = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		res.render("jewelery_all", { title: "Jewelery" });
	}
];

exports.jewelery_list = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		Jewelery.find()
			.exec(function(err, list_jewelery) {
				if (err) {
					return next(err);
				}
				res.render('jewelery_list', { title: 'Jewelery List', jewelery_list: list_jewelery });
			})
	}
];

//display detail page for a specific author
exports.jewelery_detail_get = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		Jewelery.findById(req.params.id)
			.exec(function(err, jewelery) {
				if (err) {
					return next(err);
				}
				res.render('jewelery_detail', { title: 'Jewelery Detail', jewelery: jewelery });
			})
	}
];

exports.jewelery_detail_post = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		// check('emailAddress', 'Estimated retail replacement value must not be empty').isLength({ min: 1 }).trim(),
		// Sanitize fields (using wildcard).
		var imageDataUrl;
		fetch('/:' + req.body.imageUrl)
		.then(response => {
			var reader = new FileReader();
			reader.onload = function(){ imageDataUrl = this.result; }; // <--- `this.result` contains a base64 data URI
			reader.readAsDataURL(response);
		});
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
				{
					image: imageDataUrl,
					width: 300
				},
				{
					style: 'tableExample',
					table: {
						body: [
							['Report ID', 'Date', 'Customer Information', 'Description', 'Stone Type',
							'Jewelery Weight', 'Total Stones', 'Comments'],
							[req.body.id, req.body.date, req.body.customerInfo, req.body.description,
							req.body.stoneType, req.body.jeweleryWeight, req.body.totalStones, req.body.comments]
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
				subject: 'Your Jewelery Appraisal',
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

exports.jewelery_create_get = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		res.render('jewelery_form', { title: 'Create jewelery' });
	}
];

exports.jewelery_create_post = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	// Validate fields.
	fileUpload.upload.single('file'),
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
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create a Jewelery object with escaped and trimmed data.
		var jewelery = new Jewelery(
			{
				filename: req.file.filename,
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
		} else {
			// Data from form is valid. Save jewelery.
			jewelery.save(function (err) {
				if (err) { return next(err); }
				//successful - redirect to new watch record.
				res.redirect(jewelery.url);
			});
		}
	}
];

exports.jewelery_delete_get = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
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
];

exports.jewelery_delete_post = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
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
];