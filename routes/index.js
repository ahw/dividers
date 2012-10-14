/**
 * GET home page.
 */
exports.index = function(req, res){
  // res.render('index', { title: 'Express' });
  res.header('Content-Type', 'text/plain');
  res.send('This is the home page!');
};
