// Load the dotfiles.
require('dotenv').load({silent: true});

var fs              = require('fs');
var http            = require('http');
var https           = require('https');
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

var express         = require('express');

// Middleware!
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var morgan          = require('morgan');
// var multer          = require('multer');
//var upload = multer({ dest: 'uploads/' })


var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var database        = process.env.DATABASE || process.env.MONGODB_URI || "mongodb://localhost:27017";

var settingsConfig  = require('./config/settings');
var adminConfig     = require('./config/admin');


var app             = express();


// ----- TEST 
//const {Storage} = require('@google-cloud/storage');
//const projectId = 'oxford-hack-2018';
//const storage = new Storage({
//  projectId: projectId,
//});

//const bucketName = 'oxfordhack18cv';

console.log("------- Check ---------");

//async function uploadFile(bucketName, filename) {
//  const {Storage} = require('@google-cloud/storage');
 // const storage = new Storage({projectId:'oxford-hack-2018'});
 // const bucketName = 'oxfordhack18cv';

  // Uploads a local file to the bucket
 // await storage.bucket(bucketName).upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
   // gzip: true,
    //metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      // cacheControl: 'no-cache'
	//cacheControl: 'public, max-age=31536000',
    //},
  //});
//}

	
//app.post('/upload', upload.single('file'), function (req, res, next) {    	
  //console.log("------- ATTEMPTED FILE UPLOAD ----------");
  //if (!req.file) {
    //res.status(400).send("No file uploaded.");
    //return;
  //}
  
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
//})


// Connect to mongodb
mongoose.connect(database);
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(__dirname + '/app/client'));

// Routers =====================================================================

var apiRouter = express.Router();
require('./app/server/routes/api')(apiRouter);
app.use('/api', apiRouter);

var authRouter = express.Router();
require('./app/server/routes/auth')(authRouter);
app.use('/auth', authRouter);
require('./app/server/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);


