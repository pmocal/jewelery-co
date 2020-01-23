var Watch = require('../models/watch');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var path = require('path');
var multer  = require('multer');
var nodemailer = require('nodemailer');
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
exports.watch_detail_get = function(req, res, next) {
	Watch.findById(req.params.id)
		.exec(function(err, watch) {
			if (err) {
				return next(err);
			}
			res.render('watch_detail', { title: 'Watch Detail', watch: watch });
		})
};

exports.watch_detail_post = function(req, res, next) {
	// check('emailAddress', 'Estimated retail replacement value must not be empty').isLength({ min: 1 }).trim(),
	// Sanitize fields (using wildcard).
	targetPath = path.join(__dirname, "../public/uploads/" + req.body.imageUrl + ".jpg");
	const docDefinition = {
		content: [
			{
				text: 'Manhattan Gemological Appraisals',
				color: 'royalblue',
				style: 'header'
			},
			{
				text: 'Diamond, High End Watches and Jewelry Experts',
				style: 'subheader'
			},
			{text: '36 West 47th Street\nBooth E07-W07\nNew York, NY 10036\n\nGeneral Info: 212-858-0834'},
			{
				image: targetPath,
				height: 300
			},
			{
				style: 'tableExample',
				table: {
					body: [
						['Report ID', 'Date', 'Customer Info', 'Brand', 'Reference Number', 'Serial Number', 'Model', 'Movement',
						'Case Diameter'],
						[req.body._id, req.body.date, req.body.customerInfo, req.body.brand, req.body.referenceNumber, req.body.serialNumber,
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
			'This Appraisal is given subject to the following terms, conditions & important limitations: The item(s) described in this \
			appraisal report has (have) been examined in the laboratory of Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry \
			NYC, Inc. Generally accepted grading techniques are used at the time of the examination or items described and contained \
			within the appraisal report. Depending on the grading method and qualifications of Manhattan Gemological Appraisals \
			(“MGA) & Benny’s Jewelry NYC, Inc. employees, descriptions of items contained within the appraisal report may vary accordingly. \
			The results of any other examination performed on the item may differ depending upon when, how, and by whom the \
			item is examined, and by lighting conditions, time allowed for grading, and color and hue discrimination abilities of the \
			grader, and the use of processes for altering the characteristic of a diamond or colored stone which use was previously \
			undetectable by Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. or alterations which became reversible, \
			even if the process remains undetectable. Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. makes \
			no warranty or representation regarding this report and in making this report does not agree to purchase or replace the \
			item(s) examined. All weights and measurements are approximate in accordance with grading. All information in this report \
			is approximate as the limitations of gemstone grading allow. The carat weight, clarity grade, color grade, and proportions of \
			mounted gemstones can only be estimated.\n\n',
			'The appraisal value herein is based on current information of the date indicated on the report and no opinion is being \
			expressed as to past or future value, unless expressly requested by the client expressly stated herein. The value expressed \
			herein excludes all Federal, State, and Local taxes. Each value is based on the skilled appraiser’s opinion and best judgement. \
			This report is not a guarantee, and Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. has made no \
			representation or warranty regarding this report, or that the item(s) will derive the stated value if offered for sale of any kind. \
			The accuracy of documentation submitted to Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. in \
			conjunction with any item(s) for appraisal shall not be guaranteed by Manhattan Gemological Appraisals (“MGA) & Benny’s \
			Jewelry NYC, Inc. In addition, any appraisal based on submitted documentation in addition to the item(s), shall so state on \
			the report by making reference thereto and annexing the copies of such documentation to the appraisal report. Where the \
			appraisal report includes accompanying data supplied to the Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry \
			NYC, Inc., we do not guarantee the accuracy of this data.\n\n',
			'The purpose of an insurance appraisal report is to establish the estimated retail replacement value for insurance purposes \
			in addition to providing adequate support for claim in the event of damage or loss of an item. The appraisal takes into \
			account varying prices at different marketing organization and may vary based on many factors including type and condition \
			of equipment, lighting, and the skill and experience of the appraiser. Value determination is based on the stated date’s \
			market prices, present day costs for materials, labor, design, precious gemstone(s), metal markets, and certification. The \
			state value shall represent the approximate cost of replacing the gemstone or item at the retail level. The appraisal report at \
			the date of examination is an opinion of the characteristics of the article which is the subject of this report and not a guarantee. \
			No representations or warranties regarding this appraisal report as to the accuracy are made. Manhattan Gemological \
			Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. is not responsible for any use of this report with another similar appearing \
			article. Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. and its officers, directors and employees are \
			expressly held harmless by customers including, but without limitation for any claims or actions that may arise out of \
			negligence in connection with preparation of this appraisal or laboratory report.\n\n',
			'The appraisal is made with the assumption that any diamond or other natural precious or semiprecious gemstone present in \
			the article(s) appraised is\/are NOT artificially colored or clarity enhanced. Sale of artificially colored or clarity enhanced \
			diamonds or other stones are illegal unless full disclosure is made by the seller. All items graded are the mounting permits. \
			Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. shall in no way be responsible or liable with respect to \
			this appraisal report since retail costs and margins may vary greatly based on information gathered through national survey \
			whereby averaging these costs and margins will result in an estimated retail replacement value for insurance purposes only. \
			The appraisal value shall not be used for investment purposes. This appraisal is not a recommendation to purchase. Manhattan \
			Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. can provide this report for a relatively small fee only because \
			of the following limitation on liability. Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. is not liable for \
			loss, damage (including special or consequential damages), expense, or error resulting from this report (Even if caused by \
			negligence or other fault). Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. and its employees and \
			agents shall not be liable for special or consequential damages for any error in or omission from this report caused by acts \
			of others, even if advised or the possibility of such damages. Any liability shall, in any event, never exceed the cost of producing \
			the appraisal report.\n\n',
			'Any report, trademark, or logo of Manhattan Gemological Appraisals (“MGA) & Benny’s Jewelry NYC, Inc. may not be used for \
			advertising or promotion, nor may it be reproduced without the express written permission of Manhattan Gemological \
			Appraisals (“MGA) & Benny’s Jewelry NYC, Inc.\n\n'
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
	// let transporter = nodemailer.createTransport({
	// 	host: "localhost",
	// 	port: 3000,
	// 	secure: false
	// });
	// var message = {
	//   from: "parthiv.mohan@gmail.com",
	//   to: "parthiv.mohan@gmail.com",
	//   subject: "Message title",
	//   text: "Plaintext version of the message",
	//   html: "<p>HTML version of the message</p>"
	// };
	// transporter.sendMail(message);
	generatePdfBase64.generatePdf(docDefinition, (response) => {
		res.setHeader('Content-Type', 'application/pdf');
		res.send(response);
	})
};

exports.watch_create_get = function(req, res, next) {
	res.render('watch_form', { title: 'Create watch' });
};

exports.watch_create_post = [
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

		if (req.file != null) {
			const tempPath = req.file.path;
			var fileEnding = tempPath.match(/\.[0-9a-z]{1,5}$/i);
			var targetPath;
			if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
				targetPath = path.join(__dirname, "../public/uploads/" + watch._id + ".jpg");
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