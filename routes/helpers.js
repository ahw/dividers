module.exports = function(app) {

    getHistoryByDay = function(callback) {
        getHistory(callback, 0, 0, 'day');
    };

    getHistory = function(callback, startTime, endTime, grouping) {

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

                var firstEntryStart = parseInt(reply[2]);
                var previousDayString = moment(firstEntryStart).format('YYYY-MM-DD');
                console.log('[HELPER] getHistory() previousDayString initially = ' + previousDayString);
                var day = [];

                for (var i = 0; i < (reply.length / 4); i++) {
                    var name = reply[4 * i + 1];
                    var start = parseInt(reply[4 * i + 2]);
                    var durationMillis = parseInt(reply[4 * i + 3]);
                    // Use MomentJS to format the start time to human-friendly.
                    var m = moment(start);
                    var startOfDay = m.sod();
                    var endOfDay = m.eod();
                    var offsetFromSod = m.diff(startOfDay);
                    var offsetFromEod = m.diff(endOfDay);
                    var startFormatted = m.format('ddd MMM Do, h:mm:ss a');
                    var durationHumanized;
                    var dayString = m.format('YYYY-MM-DD');
                    if (durationMillis) {
                        durationHumanized = moment.duration(durationMillis, 'milliseconds').humanize(); // Thank you, MomentJS!
                    } else {
                        var durationSoFar = Date.now() - start;
                        durationHumanized = moment.duration(durationSoFar, 'milliseconds').humanize() + ' so far...';
                    }

                    // The item representing an event.
                    var item = {
                        name : name,
                        duration : {
                            humanized : durationHumanized,
                            millis : durationMillis
                        },
                        offsetFromSod : offsetFromSod,
                        offsetFromEod : offsetFromEod,
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
                    };

                    if (grouping == 'day') {
                        // In this case, the history struct will be a list
                        // of lists; one list for each day of history,
                        // containing all the events which started on that
                        // particular day.

                        if (dayString != previousDayString) {
                            // Reset the day string.
                            previousDayString = dayString;
                            // Push the "day" struct.
                            history.push(day);
                            // Start with a blank day again.
                            day = [];
                            // Push this item onto the new day.
                            day.unshift(item);
                        } else {
                            // Assert: this item was started on the same day as the
                            // previous; just push it to the same day struct.
                            day.unshift(item);
                        }

                    } else {
                        // In this case, the history struct will be a single
                        // list containing all the events.
                        history.push(item);
                    }
                }
                callback(history);
            });
        });
    };

}
