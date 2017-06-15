var express = require('express');
var router = express.Router();

router.get('/snippets', function(req, res, next) {
  res.render('snippets', {
    page: 'snippets',
    bodyClass: 'body--resume',
    intro: '<p class="portfolio__intro">Incorporating a mixture of HTML, CSS, SVG, and JavaScript to either tell or a story or make a page come alive.</p>',
    title: 'HTML / CSS / JavaScript Interactivity'
  });
});

module.exports = router;
