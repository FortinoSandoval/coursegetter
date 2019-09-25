const express = require('express');
const cors = require('cors');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

// Download the file to root directory
const download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', callback);
  });
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.post('/auth', (req, res) => {
  const basic = req.body.basic;
  const postOptions = {
    url: 'https://techcoursesite.com/wp-json/wp/v2/posts',
    headers: {
      'User-Agent': 'request',
      Authorization: basic
    },
    method: 'GET',
    json: true
  };
  request(postOptions, (error, response) => {
    res.send(response);
  });
});

// Post creation endpoint
app.post('/post', (req, resp, next) => {
  // Basic auth
  const basic = req.body.basic;
  const image = req.body.image;
  const finalData = req.body.data;
  const finalTitle = finalData.discount === 'FREE' ? `[FREE] ${finalData.title} [Udemy]` : `[${finalData.discount}% OFF] ${finalData.title} [Udemy]`;
  const imageName = image.substring(image.indexOf('480x270') + 8, image.length);


  download(image, imageName, function () {
    // Form data for image upload to wp media
    const formData = {
      file: fs.createReadStream(__dirname + `/${imageName}`)
    };

    // request options for image upload
    const mediaOptions = {
      url: 'https://techcoursesite.com/wp-json/wp/v2/media',
      headers: {
        Authorization: basic,
        'Content-Disposition': `attachment; filename="${imageName}`,
        'content-type': 'application/octet-stream'
      },
      method: 'POST',
      formData: formData
    };

    request(mediaOptions, (error, response, body) => {
      const finalImageId = JSON.parse(body).id;

      // image delete
      fs.unlinkSync(__dirname + `/${imageName}`);

      // request options for post creation
      finalData.featured_media = finalImageId;
      finalData.title = finalTitle;
      
      const postOptions = {
        url: 'https://techcoursesite.com/wp-json/wp/v2/posts',
        headers: {
          'User-Agent': 'request',
          Authorization: basic
        },
        method: 'POST',
        body: finalData,
        json: true
      };
      request(postOptions, (error, response) => {
        resp.send(response);
      });
    });
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
