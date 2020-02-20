var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = new Schema(
	{
		_id: {type: String, required: true},
		seq: { type: Number, required: true },
	}
)

module.exports = mongoose.model('Counter', CounterSchema);