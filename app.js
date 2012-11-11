var express = require('express');
var http = require('http');
var https = require('https');
var port = 4000;
var securePort = 4443;
var app = express();
var fs = require('fs');
sprintf = require('sprintf').sprintf; // Globally available.

var redis = require('redis');
db = redis.createClient(); // Making the db globally available.
db.on("error", function(err) {
    console.log("Error " + err);
});
TIMESTAMPS = 'TIMESTAMPS'; // Globally available.
EVENTS = 'EVENTS'; // Globally available.

// Use jade templating.
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser()); // Lets us easily parse POST requests.

// Routes
require('./routes')(app);

app.get('/', function(req, res) {

    res.redirect('/events');

});

http.createServer(app).listen(port);
var options = {
    key : fs.readFileSync('../.ssl/server.key'),
    cert : fs.readFileSync('../.ssl/server.crt')
};

https.createServer(options, app).listen(securePort);
console.log(sprintf('Listening on port %s (http) and %s (https)', port, securePort));
