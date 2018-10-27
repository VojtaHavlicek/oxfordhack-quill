var User = require('./models/User');

module.exports = function(app) {

  // Application ------------------------------------------
  app.get('/', function(req, res){
    res.sendfile('./app/client/index.html');
  });


  // WILD ---- <
  /** app.post("/upload", m.single("file"), function(req, res, next) {
       const blob = bucket.file(req.file.originalname);
       const blobStream = blob.createWriteStream({
       metadata: {
           contentType: req.file.mimetype
       }
    });
	  
    blobStream.on("error", function(err) {
    });
	  
    blobStream.on("finish", function(){
    });
  // Handle file upload here...
  }); **/

  // Wildcard all other GET requests to the angular app
  app.get('*', function(req, res){
    res.sendfile('./app/client/index.html');
  });

};
