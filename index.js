// Setup Express
var express = require("express");
var app = express();
app.use(require("multer")(
  {
    dest: __dirname + '/public/uploads',
    rename: function(fieldname, filename) {
      return filename;
    }
}));
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
app.post("/upload", function(req, res){
    // Files are automatically saved by multer
    // Save text
    if(req.body.text) addText(req.body.text);
    //return res.send(JSON.stringify(req.body.text));
    // See whether files or text was uploaded
    var text = !!req.body.text, files = !!req.files.files;
    var msg = "";
    // If something was uploaded
    if(text || files){
      if(text && files) msg = "Text and files were";
      else if(text && !files) msg = "Text was";
      else msg = "Files were";
      msg += " uploaded successfully."
    }
    else msg = "Nothing was uploaded.";
    
    listUploads(function(list){
      res.render("download", 
        {
          msg: msg, 
          text: uploadedText,
          files: list
        });
    });
});

// Connect to the specified port
var server = app.listen(process.env.PORT || 3000, function(){
  // Say where we're listening for requests
  console.log(
      "httptooth.js listening at http://%s:%s", 
      server.address().address,
      server.address().port
    );
});

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
