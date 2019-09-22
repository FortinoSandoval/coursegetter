var express = require("express");
const cors = require('cors');
var app = express();
app.use(cors());
var request = require("request");
const bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


app.post("/post", (req, resp, next) => {
  const basic = req.body.basic;
  const image = req.body.image;
  const finalData = req.body.data;
  const imageName = image.substring(image.indexOf('480x270') + 8, image.length);


  download(image, imageName, function () {

    var formData = {
      file: fs.createReadStream(__dirname + `/${imageName}`),
    };
    var mediaOptions = {
      url: 'https://techcoursesite.com/wp-json/wp/v2/media',
      headers: {
        'Authorization': basic,
        'Content-Disposition': `attachment; filename="${imageName}`,
        'content-type': 'application/octet-stream'
      },
      method: 'POST',
      formData : formData
    };


    request(mediaOptions, (error, response, body) => {
      const finalImageId = JSON.parse(body).id;

      var postOptions = {
        url: 'https://techcoursesite.com/wp-json/wp/v2/posts',
        headers: {
          'User-Agent': 'request',
          'Authorization': basic
        },
        method: 'POST',
        body: finalData,
        json: true
      };

      finalData.featured_media = finalImageId;
      request(postOptions, (error, response, body) => {
        resp.send(body);
      });


    });
    
  });
});
 
// app.post("/media", (req, resp, next) => {
//   const basic = req.body.basic;
//   const data = req.body.data;
//   var options = {
//     url: 'https://techcoursesite.com/wp-json/wp/v2/media',
//     headers: {
//       'User-Agent': 'request',
//       'content-type': 'image/png',
//       'cache-control': 'no-cache',
//       'content-disposition': 'attachment; filename=tmp',
//       'Authorization': basic
//     },
//     method: 'POST',
//     body: data,
//     json: true
//   };
//   request(options, (error, response, body) => {
//     resp.send(body);
//   });
//  });

app.listen(9090, () => {
 console.log("Server running on port 3000");
});
