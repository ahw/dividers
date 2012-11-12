module.exports = function(app) {

    app.get('/history', function(req, res) {

        var history = [];
        db.sort(TIMESTAMPS, 'DESC',
            'GET', '#',
            'GET', 'event:*->pev',
            'GET', 'event:*->ev',
            function(error, reply) {

            for (var i = 0; i < (reply.length / 3); i++) {
                var timestamp = reply[3 * i];
                var pev       = reply[3 * i + 1];
                var ev        = reply[3 * i + 2];
                history.push({
                    pev : pev,
                    ev : ev,
                    timestamp : timestamp
                });
            }
            done();
        });

        var done = function() {
            var context = { history : history };
            if (req.accepts('html')) {
                res.render('history', context);
            } else if (req.accepts('json')) {
                console.log('Accepts: json');
                res.json(history);
            }
        };

    });


    app.post('/history', function(req, res) {
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

        var eventKey = 'event:' + now;
        db.hmset(eventKey, 'ev', ev, 'pev', pev, 'time', now);
        console.log(sprintf('HSET %s ev %s pev %s time %s', eventKey, ev, pev, now));
        res.json({
            pev : pev,
            ev : ev,
            offset : offset,
            id : id
        });
    });
};
