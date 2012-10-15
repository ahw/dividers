var express = require('express');
var app = express();
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
    db.zrange(TIMESTAMPS, 0, -1, function(error, reply) {
        timestamps = reply;
        var item = {}; // The container for all the data we're going to get.
        for(var i = 0; i < timestamps.length; i++) {
            eventList.push(item); // Push the container onto the event list.
            var timestamp = timestamps[i];
            item.timestamp = timestamp;
            db.get(timestamp + ':pev', function(error, reply) {
                error ? console.log(error) : null;
                item.pev = reply;
            });
            db.get(timestamp + ':ev', function(error, reply) {
                error ? console.log(error) : null;
                item.ev = reply;
            });
        }
    });

    setTimeout(function() {
        var context = {
            title : 'day division',
            eventList : JSON.stringify(eventList, null, '    ')
        };
        res.render('index', context);
    }, 3000);

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

app.listen(4000);
console.log('Listening on port 4000...');
