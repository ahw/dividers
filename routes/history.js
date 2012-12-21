module.exports = function(app) {

    app.get('/history/:timestamp?', checkAuth, function(req, res) {

        var startTime = req.params.timestamp ? req.params.timestamp : null;

        getHistory(function(history) {
            var context = { history : history.reverse() };
            // Should be using req.accepts('json'), I know.
            if (req.query.format == 'json') {
                console.log('Client requests JSON');
                res.json(history);
            } else if (req.accepts('html')) {
                console.log('Client accepts html');
                res.render('history', context);
            } else {
                console.log('Client does not accept html, does not accept json');
                res.render('history', context);
            }
        }, startTime, startTime);

    });


    app.post('/history', checkAuth, function(req, res) {

        var name, offset, offsetunits;

        if (req.body.quick_event) {
            var info = req.body.quick_event.split(' ');
            name = info[0];
            offset = info[1] ? parseInt(info[1]) : 0;
            offsetunits = info[2] ? info[2] : 'minutes';
        } else {
            name = req.body.name;
            offset = req.body.offset ? parseInt(req.body.offset) : 0; // Offset defaults to 0.
            offsetunits = req.body.offsetunits;
        }

        switch(offsetunits) {
            case 'days':
                offset = offset * 24;
            case 'hours':
                offset = offset * 60;
            case 'minutes':
                offset = offset * 60;
            case 'seconds':
            default:
                offset = offset * 1000;
        }

        // Add the timestamp to the TIMESTAMPS sorted set.
        var startTime = Date.now(); // Get time in milliseconds.
        startTime += offset;
        db.zadd(TIMESTAMPS, startTime, startTime, function(error, reply) {
            db.zrank(TIMESTAMPS, startTime, function(error, reply) {
                var index = reply;
                db.zrange(TIMESTAMPS, index - 1, index + 1, function(error, reply) {
                    var hasPrevious = false;
                    var hasNext = false;
                    switch(reply.length) {
                        case 0:
                            // Assert: Inserting at beginning. There are no
                            // timestamps either before or after this one.
                            // It is the first one inserted! We cannot
                            // calculate its duration.
                            break;
                        case 1:
                            // Should never get here. You'd have to somehow
                            // have inserted the current timestamp at index
                            // 1 greater than the size of the TIMESTAMPS
                            // set.
                            // TODO: Error log.
                            break;
                        case 2:
                            // Assert: Inserting at very end. If there are
                            // two timestamps returned, one of them must be
                            // the current one just inserted.  The other one
                            // is the one previous.
                            hasPrevious = true;
                            break;
                        case 3:
                            // Assert: Inserting in the middle. The
                            // timestamps returned represent the previous,
                            // current, and next events.
                            hasPrevious = true;
                            hasNext = true;
                            break;
                        default:
                            // TODO: Error log.
                    }

                    if (hasPrevious) {
                        var prev = parseInt(reply[0]);
                        var current = parseInt(reply[1]);
                        var durationPrevious = current - prev;
                        db.hmset('event:' + prev, 'duration', durationPrevious);
                        console.log(sprintf('[Updating a previous event\'s duration]\n\tHMSET %s duration %s', 'event:' + prev, durationPrevious));
                        db.hmset('event:' + current,
                            'name', name,
                            'start', startTime
                        );
                        console.log(sprintf('[Inserting a new event without duration]\n\tHMSET %s name %s start %s', 'event:' + current, name, startTime));
                    }

                    if (hasNext) {
                        var current = parseInt(reply[1]);
                        var next = parseInt(reply[2]);
                        var durationCurrent = next - current;
                        db.hmset('event:' + current,
                            'name', name,
                            'start', startTime,
                            'duration', durationCurrent
                        );
                        console.log(sprintf('[Inserting a new event with duration]\n\tHMSET %s\n\t\tname %s\n\t\tstart %s\n\t\tduration %s', 'event:' + current, name, startTime, durationCurrent));
                    }
                });
            });
        });

        // Echo the request back.
        res.json(req.body);
    });

    app.delete('/history/:timestamp', checkAuth, function(req, res) {

        var timestamp = req.params.timestamp;
        var response = {};

        // Remove this timestamp from the TIMESTAMPS sorted set.
        db.zrem(TIMESTAMPS, timestamp, function(error, reply) {
            response[sprintf('ZREM TIMESTAMPS %s', timestamp)] = error ? error : 'success';

            // Remove the associated event.
            db.del('event:' + timestamp, function(error, reply) {
                response[sprintf('DEL event:%s', timestamp)] = error ? error : 'success';

                res.json(response);
            });
        });

    });

};
