var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WatchSchema = new Schema(
	{
		date: {type: String, required: true},
		customerInfo: {type: String, required: true},
		brand: {type: String, required: true},
		referenceNumber: { type: String, required: true },
		serialNumber: {type: String, required: true},
		model: {type: String, required: true},
		movement: {type: String, required: true},
		caseDiameter: {type: String, required: true},
		bezelMaterial: {type: String, required: true},
		dial: {type: String, required: true},
		braceletMaterial: {type: String, required: true},
		comments: {type: String, required: true},
		claspMaterial: {type: String, required: true},
		functions: {type: String, required: true},
		year: {type: String, required: true},
		condition: {type: String, required: true},
		estimatedRetailReplacementValue: {type: String, required: true},
	}
)

WatchSchema
.virtual('url')
.get(function() {
	return '/watches/' + this._id;
});

module.exports = mongoose.model('Watch', WatchSchema);