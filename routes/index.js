var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('IloveLutz', { title: 'I love Lutz' });
});

module.exports = router;
