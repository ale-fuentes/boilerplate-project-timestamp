// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

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

app.get("/api/:date?", function (req, res) {

  //if param are empty, them use current date.
  if(!req.params.date){
    var dateUnix = Date.now().valueOf();
    var dateUTC = new Date().toUTCString();
    res.json({
      unix: dateUnix,
      utc: dateUTC
    });
  }
  else{

    const { date } = req.params;
    const isNumber = !isNaN(parseFloat(date)) && isFinite(date);
    var dataToParseDate = isNumber ? parseInt(date) : date;

    if(!Date.parse(new Date(dataToParseDate))){
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

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
