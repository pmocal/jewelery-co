var multer  = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const mongoDb = "mongodb+srv://" + process.env.DB_USER + ":" + 
	process.env.DB_PASS + "@" + process.env.DB_HOST + "/jewelery-co-upwork?retryWrites=true&w=majority";
	
const storage = new GridFsStorage({
	url: mongoDb,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = file.originalname
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads',
				}
				resolve(fileInfo);
			})
		})
	},
})

exports.upload = multer({ storage });