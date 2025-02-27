var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('log_in', { title: 'knownornot' });
});

module.exports = router;