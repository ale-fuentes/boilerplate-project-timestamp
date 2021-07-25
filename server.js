// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser')

var app = express();

// parse application/json
app.use(bodyParser.json());

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/timestamp/:date?", function (req, res) {

  //if param are empty, them use current date.
  if (!req.params.date) {
    var dateUnix = Date.now().valueOf();
    var dateUTC = new Date().toUTCString();
    res.json({
      unix: dateUnix,
      utc: dateUTC
    });
  }
  else {

    const { date } = req.params;
    const isNumber = !isNaN(parseFloat(date)) && isFinite(date);
    var dataToParseDate = isNumber ? parseInt(date) : date;

    if (!Date.parse(new Date(dataToParseDate))) {
      res.status(400).json({
        error: "Invalid Date"
      });
    }

    var unix = new Date(dataToParseDate).valueOf();
    var utc = new Date(dataToParseDate).toUTCString()

    res.json({
      unix: unix,
      utc: utc
    });
  }

});

app.get("/api/whoami", function (req, res) {
  
  const ipaddress = req.ip;
  const language = req.headers["accept-language"];
  const software = req.headers['user-agent'];

  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software
  });

});

const mapUrl = new Map();
var idUrl = 1;

app.post("/api/shorturl/:url?", function(req, res){
  
  //console.log(req.body);

  if (!req.body.url) {
    res.status(400).json({
      error: 'invalid url'
    });
  }

  const myUrl = req.body.url;
  const isIdUrl = !isNaN(parseFloat(myUrl)) && isFinite(myUrl);

  if(!isIdUrl){
    mapUrl.set(idUrl, myUrl);
  }else{
    const myRedirect = mapUrl.get(parseInt(myUrl));

    if(myRedirect){
      res.redirect(myRedirect)
    }

    res.status(400).json({
      error: 'invalid url'
    });
  }

  //console.log(mapUrl);
  
  res.json({
    original_url: myUrl,
    short_url: idUrl++
  });
  
});


app.post("/api/name", function(req, res) {
  // Handle the data in the request
  var string = req.body.first + " " + req.body.last;
  res.json({ name: string });
});

// listen for requests :)
// var listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });

app.listen(3000, function () {
  console.log('[INFO] listem in port 3000');
});