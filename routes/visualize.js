module.exports = function(app) {

    app.get('/visualize/stack', checkAuth, function(req, res) {
        getHistory(function(history) {
            var context = { history : history };
            res.render('stack', context);
        });
    });

    app.get('/visualize', checkAuth, function(req, res) {
        res.render('visualize');
    });

};
