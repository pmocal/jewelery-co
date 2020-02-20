const mongoose = require("mongoose");

exports.getNextSequence = function (name) {
	const mongoDb = "mongodb+srv://" + process.env.DB_USER + ":" + 
	process.env.DB_PASS + "@" + process.env.DB_HOST + "/jewelery-co-upwork?retryWrites=true&w=majority";
	mongoose.connect(mongoDb, { useNewUrlParser: true });
	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "mongo connection error"));
	console.log(db);
	var ret = db.counters.findAndModify(
		{
			query: { _id: name },
			update: { $inc: { seq: 1 } },
			new: true
		}
	);
	return ret.seq;
}