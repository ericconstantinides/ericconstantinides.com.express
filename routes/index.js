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

router.get('/skills', function(req, res, next) {
  res.render('index', {
    page: 'skills',
    bodyClass: 'body--resume',
    intro: '',
    title: 'Skills'
  });
});

router.get('/snippets', function(req, res, next) {
  res.render('snippets', {
    page: 'snippets',
    bodyClass: 'body--resume',
    intro: '<p class="portfolio__intro">Incorporating a mixture of HTML, CSS, SVG, and JavaScript to either tell or a story or make a page come alive.</p>',
    title: 'HTML / CSS / JavaScript Interactivity'
  });
});

router.get('/resume', function(req, res, next) {
  res.render('resume', {
    page: 'resume',
    bodyClass: 'body--resume',
  });
});

// router for ericconstantinides.com for certbot to successfully qualify:
app.get('/.well-known/acme-challenge/Odrqr9dVIHj4kmTQCbn5TI1_L5EPpLEqxH8z123rStM', function(req, res) {
  res.send('Odrqr9dVIHj4kmTQCbn5TI1_L5EPpLEqxH8z123rStM.WKo68pjMdusJRlMoXdPeDJ-t_aKAP01y6xJGz3eU9HQ')
})

module.exports = router;
