var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home_page/homePage', { title: 'Hear rate monitor' });
});

module.exports = router;
