module.exports = function(app) {

    app.get('/visualize/stack', checkAuth, function(req, res) {
        getHistory(function(history) {
            var context = { history : history.reverse() };
            res.render('stack', context);
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

};
