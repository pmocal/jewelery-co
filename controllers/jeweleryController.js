const Jewelery = require('../models/jewelery');
const { check, validationResult, sanitizeBody } = require('express-validator');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const generatePdfBase64 = require('../util/generatePdfBase64');
const ensureAuthentication = require('../util/ensureAuthentication');
const termsConditionsText = require('../util/termsConditionsText');
const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

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
	sanitizeBody('emailAddress').escape(),
	function(req, res, next) {
		Jewelery.findById(req.params.id)
			.exec(function(err, jewelery) {
				if (err) {
					return next(err);
				}
				const docDefinition = {
					pageSize: 'SRA2',
					pageMargins: [ 0, 0, 0, 0 ],
					content: [
						{
							image: __dirname + '/../public/images/jewelery_skeleton.png',
						},
						{
							image: jewelery.photo_src,
							width: 300,
							absolutePosition: {x:875, y:625}
						},
						{
							text: jewelery.id,
							absolutePosition: {x:410, y:510}
						},
						{
							text: jewelery.date,
							absolutePosition: {x:1027, y:510}
						},
						{
							text: jewelery.customerInfo,
							absolutePosition: {x:450, y:590}
						},
						{
							text: jewelery.description,
							absolutePosition: {x:86, y:715}
						},
						{
							text: jewelery.stoneType,
							absolutePosition: {x:86, y:805}
						},
						{
							text: jewelery.jeweleryWeight,
							absolutePosition: {x:86, y:910}
						},
						{
							text: jewelery.totalStones,
							absolutePosition: {x:86, y:1010}
						},
						{
							text: jewelery.comments,
							absolutePosition: {x:86, y:1115}
						},
						{
							text: jewelery.metalType,
							absolutePosition: {x:86, y:1215}
						},
						{
							text: jewelery.caratWeight,
							absolutePosition: {x:86, y:1300}
						},
						{
							text: jewelery.colorGrade,
							absolutePosition: {x:86, y:1400}
						},
						{
							text: jewelery.clarityGrade,
							absolutePosition: {x:86, y:1500}
						},
						{
							text: jewelery.estimatedRetailReplacementValue,
							absolutePosition: {x:86, y:1700}
						},
						{
							image: __dirname + '/../public/images/terms.png',
							pageBreak: 'before'
						},
					],
					defaultStyle: {
						font: 'Helvetica',
						fontSize: 25,
						alignment: 'justify'
					},
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
	upload.single('file'),
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
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create a Jewelery object with escaped and trimmed data.
		var jewelery = new Jewelery(
			{
				photo: req.file.buffer,
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