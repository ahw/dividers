module.exports = function(app) {

    app.get('/visualize/stack', checkAuth, function(req, res) {
        getHistory(function(history) {
            var context = { history : history };
            res.render('stack', context);
        });
    });

    app.get('/visualize/dividers', checkAuth, function(req, res) {
        getHistoryByDay(function(historyByDay) {
            var context = { historyByDay : historyByDay };
            res.render('dividers', context);
            // res.json(historyByDay);
        });
    });

    app.get('/visualize', checkAuth, function(req, res) {
        res.render('visualize');
    });

};
