var express = require('express');
var router = express.Router();

/* GET portfolio page. */
router.get('/', function(req, res, next) {
  let portfolio = require('../portfolio.json');
  portfolio.forEach(item => {
    item.technologiesGroup = typeof item.technologies === 'undefined' ? '' : item.technologies.join(', ');
    item.link = item.active ? `<p class="u-mb-0"><a class="external-link" href="//${item.website}" title="${item.website}" target="_top">Visit Site</a></p>` : '';
  })
  res.render('index', {
    page: 'home',
    bodyClass: '',
    title: 'Projects',
    intro: '<p class="portfolio__intro">A list of major websites and apps I have been lead developer on.</p>',
    portfolio: portfolio
  });
});

// route for certbot to qualify www.ericconstantinides.com:
router.get('/.well-known/acme-challenge/Dxs8qid5F2X6JGSkap7sf0S7PMb4CHEEE-uTUQ_v2N4', function(req, res) {
  res.send('Dxs8qid5F2X6JGSkap7sf0S7PMb4CHEEE-uTUQ_v2N4.WKo68pjMdusJRlMoXdPeDJ-t_aKAP01y6xJGz3eU9HQ');
});

module.exports = router;
