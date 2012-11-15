module.exports = function(app) {

    app.get('/history', function(req, res) {

        var history = [];
        db.sort(TIMESTAMPS, 'DESC',
            'GET', '#',
            'GET', 'event:*->name',
            'GET', 'event:*->subname',
            function(error, reply) {

            for (var i = 0; i < (reply.length / 3); i++) {
                var timestamp = reply[3 * i];
                var name      = reply[3 * i + 1];
                var subname   = reply[3 * i + 2];
                history.push({
                    name : name,
                    subname : subname,
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
        var name = req.body.name;
        var subname = req.body.subname; 
        var offset = req.body.offset;
        offset = offset ? parseInt(offset) : 0; // Offset defaults to 0.
        var id = req.body.id;

        // Add the timestamp to the TIMESTAMPS sorted set.
        var now = Math.floor(Date.now() / 1000); // Get time in seconds.
        now += offset;
        db.zadd(TIMESTAMPS, now, now);
        console.log(sprintf('ZADD %s %s (offset = %s)', now, now, offset));

        var eventKey = 'event:' + now;
        db.hmset(eventKey, 'name', name, 'subname', subname, 'time', now);
        console.log(sprintf('HSET %s name %s subname %s time %s', eventKey, name, subname, now));
        res.json({
            name : name,
            subname : subname,
            offset : offset,
            id : id
        });
    });
};
