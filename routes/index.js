var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', (req, res, next) => {
  res.render('dashboard', { user: req.user })
})

module.exports = router;
