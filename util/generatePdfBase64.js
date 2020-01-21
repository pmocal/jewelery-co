const pdfMakePrinter = require('pdfmake/src/printer');

exports.generatePdf = function(docDefinition, callback) {
	try {
		const fontDescriptors = {
			Courier: {
				normal: 'Courier',
				bold: 'Courier-Bold',
				italics: 'Courier-Oblique',
				bolditalics: 'Courier-BoldOblique'
			}
		};
		const printer = new pdfMakePrinter(fontDescriptors);
		const doc = printer.createPdfKitDocument(docDefinition);
		
		let chunks = [];

		doc.on('data', (chunk) => {
			chunks.push(chunk);
		});
	
		doc.on('end', () => {
			const result = Buffer.concat(chunks);
			callback('data:application/pdf;base64,' + result.toString('base64'));
		});
		
		doc.end();
		
	} catch(err) {
		throw(err);
	}
};