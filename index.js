// Setup Express
var http = require('http');
var express = require("express");
var app = express();
var path = require('path');

var uploadsDir = __dirname + '/public/uploads';

var ufn = require('unique-file-name')({
  // Slugified file name, followed optionally by an integer (to keep names
  // unique), followed by the slugified extension.
  format: '%b%i%e',
  dir: uploadsDir
});

var multer = require('multer');

var storage = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: function (req, file, cb) {
      // Write an empty file, then have multer overwite it
      ufn(file.originalname, function(err, file){
        if(err) return cb(err);
        cb(err, path.basename(file));
      });
    }
  })
});

app.use(require("body-parser").json());

var fs = require("fs");
// Declare an array for uploaded text
var uploadedText = [];

// Configure views
app.set("views", "./views");
app.set("view engine", "jade");

// Server static files
app.use("/assets", express.static("public/assets"));

// GET pages
app.get("/", function(req, res){
  res.render("index");
});

app.get("/upload", function(req, res){
  res.render("upload");
});

app.get("/download", function(req, res){
  // Find uploaded files
  listUploads(function(files){
    res.render("download", {text: uploadedText, files: files});
  });
});

app.get("/uploads/:file", function(req, res){
  res.download(__dirname + "/public/uploads/" + req.params.file);
});

// POST data
app.post("/upload", storage.array('files[]'), function(req, res){

    // Files are automatically saved by multer
    // Save text
    if(req.body.text) addText(req.body.text);

    // See whether files or text was uploaded
    var text = !!req.body.text, files = req.files.length > 0;
    var msg, success;
    // If something was uploaded
    if(text || files) {
      success = true;
      msg = 'Successfully uploaded ';
      var fileMsg;
      if(files) {
        var count = req.files.length;
        fileMsg = count + (count == 1 ? ' file' : ' files');
      }
      if(text && files) msg += 'text and ' + fileMsg + '.';
      else if(text && !files) msg += 'text.';
      else msg += fileMsg + '.';
    }
    else {
      msg = "Nothing was uploaded.";
      success = false;
    }

    listUploads(function(list){
      res.render("download",
        {
          msg: msg,
          success: success,
          text: uploadedText,
          files: list
        });
    });
});

var server = http.createServer(app);
server.on('listening', function() {
  console.log('httptooth.js listening on port ' + server.address().port);
});
server.on('error', function(err){
  // If the port was specified, throw an error for the failed binding
  if(process.env.PORT) throw new Error('Could not bind to specified port ' + process.env.PORT);
  // Try the next port if this one is in use
  else if(err.code === 'EADDRINUSE') {
    server.listen(err.port + 1);
  }
  else throw err;
});
server.listen(process.env.PORT || 3000);

// Saves a new piece of uploaded text
function addText(text){
  uploadedText.push(text);
  fs.writeFile(__dirname + "/public/uploaded_text.json",
    JSON.stringify(uploadedText),
    function(err) {if(err) throw err;});
}

fs.readFile(__dirname + "/public/uploaded_text.json",
  "utf8",
   function(err, data){
     if(err && err.code != "ENOENT") throw err;
     else if (data) uploadedText = JSON.parse(data);
});

// Calls cb with an array of files in public/uploads
// Each element has a name and url
function listUploads(cb){
  var list = [];
  var dir = __dirname + "/public/uploads/";
  // List files and dirs
  fs.readdir(dir, function(err, files){
    // The dir doesn't have to exist
    if(err && err.code == "ENOENT") return [];
    else if(err) throw err;
    // Check each to see if it's a file
    for(var i = 0; i < files.length; i++){
      // If it's a file, add it to the list
      if(!fs.statSync(dir + files[i]).isDirectory()){
        list.push(
          {
            name: files[i],
            url: "/uploads/"+files[i]
          }
        );
      }
    }
    // Send the list to the callback
    cb(list);
  });
}
