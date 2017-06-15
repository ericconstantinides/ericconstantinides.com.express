var express = require('express');
var router = express.Router();

router.get('/resume', function(req, res, next) {
  res.render('resume', {
    page: 'resume',
    bodyClass: 'body--resume',
  });
});

module.exports = router;
