var express = require('express');
var router = express.Router();
const fs = require('fs').promises;

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const data = await fs.readFile("config/terms_and_condition.txt", 'utf8');
    await res.render('sign_up', { title: 'knownornot', termsAndCondition : data});
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    res.render('sign_up', { title: 'knownornot', termsAndCondition : null});
  }
});

module.exports = router;