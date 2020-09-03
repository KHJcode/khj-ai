const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index/index', { css: '../style/index/index.css' });
});

router.get('/test', (req, res) => {
  res.render('test/test', { css : '../style/test/test.css' });
});


module.exports = router;
