var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WatchSchema = new Schema(
	{
		reportId: {type: String, required: true},
		customerInfo: {type: String, required: true},
		brand: {type: String, required: true},
		referenceNumber: { type: String, required: true },
		serialNumber: {type: Boolean, required: true},
		model: {type: Boolean, required: true},
		movement: {type: Boolean, required: true},
		caseDiameter: {type: Boolean, required: true},
		bezelMaterial: {type: Boolean, required: true},
		dial: {type: Boolean, required: true},
		braceletMaterial: {type: Boolean, required: true},
		comments: {type: Boolean, required: true},
		claspMaterial: {type: Boolean, required: true},
		functions: {type: Boolean, required: true},
		year: {type: Boolean, required: true},
		condition: {type: Boolean, required: true},
		estimatedRetailReplacementValue: {type: Boolean, required: true}
	}
)

WatchSchema
.virtual('url')
.get(function() {
	return '/watches/' + this._id;
});

module.exports = mongoose.model('Watch', WatchSchema);