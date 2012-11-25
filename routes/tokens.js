module.exports = function(app) {

    var getAllTokens = function(callback) {

        db.smembers(TOKENS, function(error, reply) {
            callback(reply);
        });
    };

    var getAllUrls = function(originalToken, callback) {
        
        db.smembers('TOKENSET:' + originalToken, function(error, reply) {
            callback(originalToken, reply);
        });
    };

    app.get('/tokens', checkAuth, function(req, res) {

        var allTokenSets = {};

        getAllTokens(function(tokens) {
            var numTokens = tokens.length;
            for (var i = 0; i < tokens.length; i++) {
                getAllUrls(tokens[i], function(originalToken, urls) {
                    allTokenSets[originalToken] = urls;
                    console.log(sprintf('[TOKENS] %s = %s', originalToken, urls));
                    if (Object.keys(allTokenSets).length == numTokens) {
                        console.log('[TOKENS] All tokens retrieved. Rendering');
                        res.render('tokens', { allTokenSets : allTokenSets });
                    }
                });
            }
        });

    });


    app.post('/tokens', checkAuth, function(req, res) {
        var urls = req.body.urls.split('\n');
        var ttl = req.body.ttl;
        ttl = ttl ? parseInt(ttl) : false; // Default to infinite lifespan.
        var ttlUnits = req.body.ttlunits;

        // Convert all time units to seconds
        switch(ttlUnits) {
            case 'days':
                ttl = ttl * 24;
            case 'hours':
                ttl = ttl * 60;
            case 'minutes':
                ttl = ttl * 60;
        }

        var shasum = crypto.createHash('sha1');
        shasum.update(req.body.urls + Date.now())
        var hashValue = shasum.digest('hex');
        db.sadd(TOKENS, hashValue, function(error, reply) {

            var multi = db.multi();
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i].trim();
                if (url.indexOf('?') >= 0) {
                    // Assert: there is already a query string present
                    url += '&token=' + hashValue;
                } else {
                    // Assert: no query string
                    url += '?token=' + hashValue;
                }
                console.log('[TOKENS] Creating token for ' + url);
                multi.sadd('TOKENSET:' + hashValue, url);
            }

            // Set the expiration value if there is one.
            if (ttl) {
                console.log('[TOKENS] Setting time to live: ' + ttl + ' seconds');
                multi.expire('TOKENSET:' + hashValue, ttl);
            } else {
                console.log('[TOKENS] Setting time to live: forever');
            }

            multi.exec(function(error, reply) {
                res.redirect('/tokens');
            });

        });

    });

    app.delete('/tokens/:token', checkAuth, function(req, res) {

        var response = {};
        var token = req.params.token;
        db.srem(TOKENS, token, function(error, reply) {
            response[sprintf('SREM TOKENS %s', token)] = error ? error : 'success';

            db.del('TOKENSET:' + token, function(error, reply) {
                response[sprintf('DEL TOKENSET:%s', token)] = error ? error : 'success';
                res.json(response);
            });

        });

    });

};
