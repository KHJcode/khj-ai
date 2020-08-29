const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index/index', { css : '../style/index/index.css' });
});

module.exports = router;