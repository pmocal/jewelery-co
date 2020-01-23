var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JewelerySchema = new Schema(
	{
		date: {type: String, required: true},
		customerInfo: {type: String, required: true},
		description: {type: String, required: true},
		stoneType: { type: String, required: true },
		jeweleryWeight: {type: String, required: true},
		totalStones: {type: String, required: true},
		comments: {type: String, required: true},
		serialNumber: {type: String, required: true},
		metalType: {type: String, required: true},
		caratWeight: {type: String, required: true},
		colorGrade: {type: String, required: true},
		clarityGrade: {type: String, required: true},
		estimatedRetailReplacementValue: {type: String, required: true},
	}
)

JewelerySchema
.virtual('url')
.get(function() {
	return '/jewelery/' + this._id;
});

module.exports = mongoose.model('Jewelery', JewelerySchema);