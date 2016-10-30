var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Rummy Game' });
});

/* Handle request to display something */
//router.get('/display', function(req, res, next) {
//  do something
//});

module.exports = router;
