var express = require('express');
var http = require('http');
var https = require('https');
var port = 4000;
var securePort = 4443;
var app = express();
var fs = require('fs');
crypto = require('crypto');
sprintf = require('sprintf').sprintf; // Globally available.
moment = require('moment'); // Globally available.


// Sessions and cookies
app.use(express.cookieParser('ew329fj23kekwwe2'));
app.use(express.session());


var redis = require('redis');
db = redis.createClient(); // Making the db globally available.
db.on("error", function(err) {
    console.log("Error " + err);
});
TIMESTAMPS = 'TIMESTAMPS'; // Globally available.
EVENTS = 'EVENTS'; // Globally available.
TOKENS = 'TOKENS'; // Globally available.

// Use jade templating.
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser()); // Lets us easily parse POST requests.

// Hacky authentication
checkAuth = function(req, res, next) {

    if (!req.session.is_logged_in) {
        console.log('[AUTH] Authentication failed.');

        // Check if the user has a valid public-access token.
        var token = req.query.token;
        if (token) {
            db.sismember(TOKENS, token, function(error, reply) {
                if (reply) {
                    // Assert: token is a valid token.
                    console.log('[AUTH] User has valid token ' + token);

                    // Test if the current URL is a member of this token
                    // set.
                    db.sismember('TOKENSET:' + token, req.url, function(error, reply) {
                        if (reply) {
                            console.log('[AUTH] Authorization success');
                            next();
                        } else {
                            console.log('[AUTH] Authorization failed, token has likely expired');
                            res.render('error', { message : 'This token doesn\'t work for this URL (it may have expired).' });
                        }
                    });
                } else {
                    console.log('[AUTH] User has invalid token ' + token);
                    res.render('error', {message : 'It appears you have an invalid token.'});
                }
            });
        } else {
            res.render('error', { message : 'I\'m really the only user of this tool. Most of the functionality is blocked.' });
        }
    } else {
        console.log('[AUTH] Authentication passed.');
        next();
    }
};

isMobile = function(req) {

    var isMobile = /mobile/i.test(req.header('user-agent'));
    if (isMobile) {
        console.log('User agent is mobile');
    }
    return isMobile;
};

app.get('/login', function(req, res) {
    if (req.session.is_logged_in == true) {
        console.log('[AUTH] Already logged in, redirecting.');
        res.render('login', { message : "You have already logged in" });
    } else {
        res.render('login', { message : "Please login" });
    }
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // Get the hash value of the pasword.
    var shasum = crypto.createHash('sha1');
    shasum.update(password);
    var hashValue = shasum.digest('hex');

    // Retrieve password hash from db.
    var key = 'user:' + username;
    db.hget(key, 'hash', function(error, reply) {
        var dbHashValue = reply;
        if (dbHashValue == hashValue) {
            req.session.is_logged_in = true;
            res.redirect('/');
        } else {
            res.render('login', { message : "Invalid username/password" });
        }
    });
});

app.get('/logout', function(req, res) {

    req.session.destroy();
    res.render('login', { message : "You have successfully logged out" });
});

// Routes
require('./routes')(app);

app.get('/', function(req, res) {

    res.redirect('/events');

});

http.createServer(app).listen(port);
var options = {
    key : fs.readFileSync('../.ssl/server.key'),
    cert : fs.readFileSync('../.ssl/server.crt')
};

https.createServer(options, app).listen(securePort);
console.log(sprintf('Listening on port %s (http) and %s (https)', port, securePort));
