var express = require('express');
var http = require('http');
var https = require('https');
var port = 4000;
var securePort = 4443;
var app = express();
var fs = require('fs');
var sprintf = require('sprintf').sprintf;

var redis = require('redis');
var db = redis.createClient();
db.on("error", function(err) {
    console.log("Error " + err);
});
var TIMESTAMPS = 'TIMESTAMPS';

// Use jade templating.
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser()); // Lets us easily parse POST requests.

app.get('/', function(req, res) {

    var eventList = [];
    var timestamps = [];
    db.sort(TIMESTAMPS,
        'GET', '#',
        'GET', 'event:*->pev',
        'GET', 'event:*->ev',
        function(error, reply) {

        console.log('REPLY:');
        console.log(JSON.stringify(reply, null, '    '));
        for (var i = 0; i < (reply.length / 3); i++) {
            var timestamp = reply[3 * i];
            var pev       = reply[3 * i + 1];
            var ev        = reply[3 * i + 2];
            console.log('Timestamp    : ', reply[3 * i]);
            console.log('Parent event : ', reply[3 * i + 1]);
            console.log('Event        : ', reply[3 * i + 2]);
            eventList.push({
                pev : pev,
                ev : ev,
                timestamp : timestamps
            });

        }
    });

    var context = {
        title : 'day division',
        eventList : JSON.stringify(eventList, null, '    ')
    };
    res.render('index', context);

});

app.post('/events', function(req, res) {
    var pev = req.body.pev;
    var ev = req.body.ev; 
    var offset = req.body.offset;
    offset = offset ? parseInt(offset) : 0; // Offset defaults to 0.
    var id = req.body.id;

    // Add the timestamp to the TIMESTAMPS sorted set.
    var now = Math.floor(Date.now() / 1000); // Get time in seconds.
    now += offset;
    db.zadd(TIMESTAMPS, now, now);
    console.log(sprintf('ZADD %s %s (offset = %s)', now, now, offset));

    var pevKey = now + ':pev';
    var evKey = now + ':ev';
    db.set(pevKey, pev);
    console.log(sprintf('SET %s %s', pevKey, pev));
    db.set(evKey, ev);
    console.log(sprintf('SET %s %s', evKey, ev));

    res.json({
        pev : pev,
        ev : ev,
        offset : offset,
        id : id
    });
});

http.createServer(app).listen(port);
var options = {
    key : fs.readFileSync('../.ssl/server.key'),
    cert : fs.readFileSync('../.ssl/server.crt')
};

https.createServer(options, app).listen(securePort);
console.log(sprintf('Listening on port %s (http) and %s (https)', port, securePort));
