var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads')
	},
	filename: function (req, file, cb) {
		cb(null, req._filename + '.jpg');
	}
});

var app = new express();
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var multerMiddle = multer({
	storage: storage,
	limits: {
		fileSize: 1000*1000*10, // not sure 10 MB
		files: 1,
		fields: 1
	}
}).single('upl');

var testMiddle = function (req, res, next) {
	console.log(req._filename = 'setFilename');
	next();
}

app.get('/', function(req, res){
  res.render('index');
});

app.post('/', [testMiddle, multerMiddle], function(req,res) {
	console.log(req.body); //form fields
	console.log(req.file); //form files
	//res.status(204).end();
	var title = req.body.title;
	if (title.length > 5) {
		res.send('ERROR : title length more than 5');
	}
	else {
		res.send('success');
	}
});

var port = 3000;
app.listen( port, function() {
	console.log('listening on port '+ port);
});

