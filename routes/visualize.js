module.exports = function(app) {

    app.get('/visualize/stack', checkAuth, function(req, res) {
        getHistory(function(history) {
            var context = { history : history.reverse() };
            res.render('stack', context);
        });
    });

    app.get('/visualize/stack/csv', checkAuth, function(req, res) {
        getHistory(function(history) {
            var context = { history : history };
            res.render('stack-csv', context);
        });
    });

    app.get('/visualize/dividers', function(req, res) {
        getHistoryByDay(function(historyByDay) {
            var context = { historyByDay : historyByDay.reverse() };
            res.render('dividers', context);
            // res.json(historyByDay);
        });
    });

    app.get('/visualize', checkAuth, function(req, res) {
        res.render('visualize');
    });

    app.get('/visualize/histogram/:name/:bucketSizeMinutes', checkAuth, function(req, res) {
        var bucketSizeMinutes = parseInt(req.params.bucketSizeMinutes);
        console.log('bucketSizeMinutes = ' + bucketSizeMinutes);
        var name = req.params.name;
        var total = 0;
        var max = 0;
        getHistory(function(history) {
            var histogramValues = {};
            history.forEach(function(item) {
                if (item.name.indexOf(name) >= 0) {
                    total++;
                    console.log('Inspecting ' + item.name + ' ' + item.duration.humanized);
                    var bucket = bucketSizeMinutes * Math.floor(parseInt(item.duration.millis) / (bucketSizeMinutes * 60 * 1000));
                    console.log(Math.floor(parseInt(item.duration.millis) / (bucketSizeMinutes * 60 * 1000)));
                    if (histogramValues[bucket]) {
                        histogramValues[bucket]++;
                    } else {
                        histogramValues[bucket] = 1;
                    }

                    if (histogramValues[bucket] > max) {
                        max = histogramValues[bucket];
                    }
                }
            });
            console.log(JSON.stringify(histogramValues, null, '   '));
            console.log('Total counted = ' + total);
            res.render('histogram', {
                max : max,
                name : name,
                histogramValues : histogramValues
            });
        });
    });

};
