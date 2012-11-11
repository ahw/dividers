/**
 * Dynamically add all routes in this directory.
 */
var fs = require('fs');

module.exports = function(app) {
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file != 'index.js' // Do not add index.js.
            && file.indexOf('.js') > 0 // Ensure it is a .js file.
            && file.indexOf('.swp') == -1) { // Do not add temp files.

            console.log('Adding route ' + file);
            var name = file.substr(0, file.indexOf('.'));
            require('./' + name)(app);
        }
    });
};
