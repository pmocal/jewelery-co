var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JewelerySchema = new Schema(
	{
		_id: {type: Number, required: true},
		photo: {type: Buffer},
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
	},
	{
		collection: 'jewelery'
	}
)

JewelerySchema
.virtual('url')
.get(function() {
	return '/jewelery/' + this._id;
});

JewelerySchema
.virtual('photo_src')
.get(function() {
	if (this.photo) {
		return 'data:image/png;base64,' + this.photo.toString('base64');
	} else {
		return;
	}
})

module.exports = mongoose.model('Jewelery', JewelerySchema);