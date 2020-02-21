const Watch = require('../models/watch');
const Counter = require('../models/counter');
const { check, validationResult, sanitizeBody } = require('express-validator');
const path = require('path');
const nodemailer = require('nodemailer');
const generatePdfBase64 = require('../util/generatePdfBase64');
const ensureAuthentication = require('../util/ensureAuthentication');
const termsConditionsText = require('../util/termsConditionsText');
const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

exports.watch_all = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		res.render("watch_all", { title: "Watch Appraisals" });
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
	sanitizeBody('emailAddress').escape(),
	function(req, res, next) {
		Watch.findById(req.params.id)
			.exec(function(err, watch) {
				if (err) {
					return next(err);
				}
				const docDefinition = {
					pageSize: 'SRA2',
					pageMargins: [ 0, 0, 0, 0 ],
					content: [
						{
							image: __dirname + '/../public/images/watch_skeleton.png',
						},
						{
							image: watch.photo_src,
							width: 450,
							absolutePosition: {x:600, y:1000}
						},
						{
							text: watch.id,
							absolutePosition: {x:410, y:510}
						},
						{
							text: watch.date,
							absolutePosition: {x:1027, y:510}
						},
						{
							text: 'Customer Info: ' + watch.customerInfo,
							absolutePosition: {x:86, y:668}
						},
						{
							text: watch.brand,
							absolutePosition: {x:86, y:765}
						},
						{
							text: watch.claspMaterial,
							absolutePosition: {x:450, y:765}
						},
						{
							text: watch.referenceNumber,
							absolutePosition: {x:86, y:825}
						},
						{
							text: watch.serialNumber,
							absolutePosition: {x:86, y:900}
						},
						{
							text: watch.model,
							absolutePosition: {x:86, y:975}
						},
						{
							text: watch.movement,
							absolutePosition: {x:86, y:1050}
						},
						{
							text: watch.caseDiameter,
							absolutePosition: {x:86, y:1120}
						},
						{
							text: watch.bezelMaterial,
							absolutePosition: {x:86, y:1195}
						},
						{
							text: watch.dial,
							absolutePosition: {x:86, y:1270}
						},
						{
							text: watch.braceletMaterial,
							absolutePosition: {x:86, y:1345}
						},
						{
							text: watch.comments,
							absolutePosition: {x:86, y:1430}
						},
						{
							text: watch.functions,
							absolutePosition: {x:450, y:835}
						},
						{
							text: watch.year,
							absolutePosition: {x:450, y:905}
						},
						{
							text: watch.condition,
							absolutePosition: {x:450, y:980}
						},
						{
							text: "$" + watch.estimatedRetailReplacementValue,
							absolutePosition: {x:86, y:1625}
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
					}
				};

				generatePdfBase64.generatePdf(docDefinition, (response) => {
					let transporter = nodemailer.createTransport({
						sendmail: true,
						host: 'vps31943.inmotionhosting.com',
						port: 587,
						secure: false,
						auth: {
							user: 'admin',
							pass: 'Alpha4560!'
						}
					});
					
					var mailOptions = {
						from: 'admin@manhattangemologicalappraisals.com',
						to: req.body.emailAddress,
						subject: 'Your Watch Appraisal',
						text: 'Your appraisal is attached in a PDF. Do not reply to this email. Contact adamshalit@gmail.com instead.',
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

exports.watch_create_get = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	function(req, res, next) {
		res.render('watch_form', { title: 'Create Watch' });
	}
];

exports.watch_create_post = [
	ensureAuthentication.noCache,
	ensureAuthentication.ensureAuthenticated,
	// Validate fields.
	upload.single('file'),
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
	// Process request after validation and sanitization.
	(req, res, next) => {
		Counter.findByIdAndUpdate(
				"userid",
				{ $inc: { seq: 1 } },
				{ new: true }
			).exec(function(err, thedocument) {
				if (err) {
					return err;
				}
				// Extract the validation errors from a request.
				const errors = validationResult(req);
				// Create a Watch object with escaped and trimmed data.
				var watch = new Watch(
					{
						_id: thedocument.seq,
						photo: req.file.buffer,
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
			})
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