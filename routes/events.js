module.exports = function(app) {

    app.get('/events', function(req, res) {

        var events = [];
        db.sort(EVENTS, 'ALPHA', function(error, reply) {
            
            for (var i = 0; i < reply.length; i++) {
                events.push({
                    name : reply[i].split(':')[0],
                    subname : reply[i].split(':')[1],
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

        var name = req.body.name;
        var subname = req.body.subname;

        var fullName = subname ? name + ':' + subname : name;
        console.log(sprintf('Adding %s to EVENTS', fullName));
        db.sadd(EVENTS, fullName, function(error, reply) {
            console.log('error = ' + JSON.stringify(error));
            console.log('reply = ' + JSON.stringify(reply));
            res.redirect('/events');
            // res.json(200, {
            //     error : error,
            //     reply : reply
            // });
        });
    });

    app.delete('/events', function(req, res) {

        var fullName = req.body.fullName;
        db.srem(EVENTS, fullName, function(error, reply) {
            console.log(sprintf('Removing %s from EVENTS', fullName));
            console.log('error = ' + JSON.stringify(error));
            console.log('reply = ' + JSON.stringify(reply));
            res.json(200, {
                error : error,
                reply : reply
            });
        });
    });
};
