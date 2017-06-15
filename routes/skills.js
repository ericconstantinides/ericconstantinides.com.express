var express = require('express');
var router = express.Router();

router.get('/skills', function(req, res, next) {
  res.render('index', {
    page: 'skills',
    bodyClass: 'body--resume',
    intro: '',
    title: 'Skills'
  });
});

module.exports = router;
