var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('data_info/dataInfo', { title: 'Data info' });
});

module.exports = router;
