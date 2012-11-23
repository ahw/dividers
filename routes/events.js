module.exports = function(app) {

    app.get('/events', function(req, res) {

        db.sort(EVENTS, 'ALPHA', function(error, reply) {

            var events = [];
            for (var i = 0; i < reply.length; i++) {
                events.push({name : reply[i]});
            }

            var context = {
                events : events
            };
            res.render('index', context);
        });
    });

    app.post('/events', function(req, res) {

        var name = req.body.name;
        console.log(sprintf('Adding %s to EVENTS', name));
        db.sadd(EVENTS, name, function(error, reply) {
            res.redirect('/events');
            // res.json(200, {
            //     error : error,
            //     reply : reply
            // });
        });
    });

    app.delete('/events', function(req, res) {

        var name = req.body.name;
        db.srem(EVENTS, name, function(error, reply) {
            console.log(sprintf('Removing %s from EVENTS', name));
            res.json(200, {
                error : error,
                reply : reply
            });
        });
    });
};
