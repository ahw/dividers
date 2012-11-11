module.exports = function(app) {

    app.get('/events', function(req, res) {

        var events = [];
        db.sort(EVENTS, 'ALPHA', function(error, reply) {
            
            for (var i = 0; i < reply.length; i++) {
                events.push({
                    pev : reply[i].split(':')[0],
                    ev : reply[i].split(':')[1],
                    offset : 0
                });
            }
            done();

        });

        var done = function() {
            if (events.length) {
                var context = {
                    title : 'dividers',
                    events : events
                };
                res.render('index', context);
            }
        };

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

