var fs = require('fs');
var http = require('http');

function downloadHeader() {
  var headerFile = process.env.HEADER_FILE;
  if (headerFile !== null && headerFile !== undefined) {
    console.info("Downloading header file from '" + headerFile + "'");
    var dest = './views/partials/header.hbs';
    var file = fs.createWriteStream(dest);
    var request = http.get(headerFile, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();
      });
    }).on('error', function(err) {
      fs.unlink(dest);
      console.error(err);
    });
  } else {
    console.info("HEADER_FILE environment variable not passed or null");
  }
}

downloadHeader();
