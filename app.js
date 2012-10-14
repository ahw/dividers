var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser()); // Lets us easily parse POST requests.

app.get('/', function(req, res) {
    res.render('index', { title: 'day divisions' });
});

app.post('/events', function(req, res) {
    var pev = req.body.pev;
    var ev = req.body.ev; 
    var offset = req.body.offset;
    var id = req.body.id;

    res.json({
        pev : pev,
        ev : ev,
        offset : offset,
        id : id
    });
});

app.listen(4000);
console.log('Listening on port 4000...');
