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


};