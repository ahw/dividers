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
};
