module.exports = function(app) {

    var getHistory = function(callback, startTime, endTime) {

        var startTime = startTime ? startTime : 0;
        var endTime = endTime ? endTime : 0;

        var multi = db.multi();
        multi.zrevrank(TIMESTAMPS, endTime);
        multi.zrevrank(TIMESTAMPS, startTime);

        multi.exec(function(error, replies) {
            var startIndex = replies[0] ? replies[0] : 0;
            var limit = replies[1] ? (replies[1] - startIndex) + 1 : -1;

            // TODO Remove
            console.log('GET /history starting at = ' + startIndex);
            console.log('GET /history limiting to = ' + limit + ' results');

            var history = [];
            db.sort(TIMESTAMPS,
                'LIMIT', startIndex, limit,
                'DESC',
                'GET', '#',
                'GET', 'event:*->name',
                'GET', 'event:*->start',
                'GET', 'event:*->duration',
                function(error, reply) {

                for (var i = 0; i < (reply.length / 4); i++) {
                    var name = reply[4 * i + 1];
                    var start = parseInt(reply[4 * i + 2]);
                    var duration = parseInt(reply[4 * i + 3]);
                    // Use MomentJS to format the start time to human-friendly.
                    var m = moment(start);
                    var timeFormatted = m.format('ddd MMM Do, h:mm:ss a');
                    var durationString;
                    if (duration) {
                        durationString = moment.duration(duration, 'milliseconds').humanize(); // Thank you, MomentJS!
                    } else {
                        durationString = 'Ongoing...';
                    }
                    history.push({
                        name : name,
                        start : start,
                        durationString : durationString,
                        duration : duration,
                        timeFormatted : timeFormatted,
                        timeDay    : m.format('dddd'),
                        timeMonth  : m.format('MMM'),
                        timeDate   : m.format('Do'),
                        timeHour   : m.format('h'),
                        timeMinute : m.format('mm'),
                        timeSecond : m.format('ss'),
                        timeAmPm   : m.format('a')
                    });
                }
                callback(history);
            });
        });
    };

    app.get('/visualize/stack', function(req, res) {

        getHistory(function(history) {
            var context = { history : history };
            res.render('stack', context);
        });

    });

    app.get('/visualize', function(req, res) {

        res.render('visualize');
    });

};
