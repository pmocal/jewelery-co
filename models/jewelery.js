var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JewelerySchema = new Schema(
	{
		reportId: {type: String, required: true},
		customerInfo: {type: String, required: true},
		description: {type: String, required: true},
		stoneType: { type: String, required: true },
		jeweleryWeight: {type: Boolean, required: true},
		totalStones: {type: Boolean, required: true},
		comments: {type: Boolean, required: true},
		serialNumber: {type: Boolean, required: true},
		metalType: {type: Boolean, required: true},
		caratWeight: {type: Boolean, required: true},
		colorGrade: {type: Boolean, required: true},
		clarityGrade: {type: Boolean, required: true},
		estimatedRetailReplacementValue: {type: Boolean, required: true}
	}
)

JewelerySchema
.virtual('url')
.get(function() {
	return '/jewelery/' + this._id;
});

module.exports = mongoose.model('Jewelery', JewelerySchema);