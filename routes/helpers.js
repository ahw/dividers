module.exports = function(app) {

    getHistory = function(callback, startTime, endTime) {

        var startTime = startTime ? startTime : 0;
        var endTime = endTime ? endTime : 0;

        var multi = db.multi();
        multi.zrevrank(TIMESTAMPS, endTime);
        multi.zrevrank(TIMESTAMPS, startTime);

        multi.exec(function(error, replies) {
            var startIndex = replies[0] ? replies[0] : 0;
            var limit = replies[1] ? (replies[1] - startIndex) + 1 : -1;

            // TODO Remove
            console.log('History starting at = ' + startIndex);
            console.log('History limiting to = ' + limit + ' results');

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
                    var durationMillis = parseInt(reply[4 * i + 3]);
                    // Use MomentJS to format the start time to human-friendly.
                    var m = moment(start);
                    var startFormatted = m.format('ddd MMM Do, h:mm:ss a');
                    var durationHumanized;
                    if (durationMillis) {
                        durationHumanized = moment.duration(durationMillis, 'milliseconds').humanize(); // Thank you, MomentJS!
                    } else {
                        var durationSoFar = Date.now() - start;
                        durationHumanized = moment.duration(durationSoFar, 'milliseconds').humanize() + ' so far...';
                    }
                    history.push({
                        name : name,
                        duration : {
                            humanized : durationHumanized,
                            millis : durationMillis
                        },
                        start : {
                            millis : start,
                            formatted : startFormatted,
                            day    : m.format('dddd'),
                            month  : m.format('MMM'),
                            date   : m.format('Do'),
                            hour   : m.format('h'),
                            minute : m.format('mm'),
                            second : m.format('ss'),
                            amPm   : m.format('a')
                        }
                    });
                }
                callback(history);
            });
        });
    };

}
