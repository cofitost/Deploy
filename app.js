const ncp = require('ncp').ncp;
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var rimraf = require("rimraf");
var glob = require("glob");

var app = express();
var port = 7777; // you can use any port
var wspDir = '../workspace/';
var websitDir = '../html/';
console.log('server on ' + port);

app.use(bodyParser.json());

//copy assignment from workspace/ to html/
app.post('/deploy', function (req, res) {
  console.log('sending...');
  console.log(req.body.jobName);

  if (fs.existsSync(websitDir + req.body.jobName)) {
    undeploy(req.body.jobName);
  }

  ncp(wspDir + req.body.jobName + '/src/web/', websitDir + req.body.jobName, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('done!');
    res.status(200).send(req.body.jobName);
  });
})

//delete assignment in html/
app.post('/undeploy', function (req, res) {
  undeploy(req.body.jobName);
  res.status(200).send('OK');
})

//to get all html file path
app.get('/getAllFiles', function (req, res) {
  console.log(req.query.jobName);
  glob(websitDir + req.query.jobName + '/**/*.html', function (err, files) {
    if (err)
      console.error(err);
      
    console.log(files[0]);
    console.log(files.length);
    for(var i = 0; i < files.length; i++) {
      
    }
    res.status(200).send(files);
  })
})

function undeploy(jobName) {
  rimraf(websitDir + jobName, function (err) {
    if (err)
      console.error(err); 
  });
}

app.listen(port);
