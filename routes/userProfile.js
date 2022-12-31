var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user_profile/userProfile', { title: 'User profile' });
});

module.exports = router;