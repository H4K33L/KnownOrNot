var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res, next) {
  res.render('log_in', { title: 'knownornot' });
});

router.post('/', async function(req, res, next) {
  const {email, password } = req.body;
  const db = new sqlite3.Database('./BDD/db.sqlite');
  await db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (err || row === undefined) {
      // add error message
      res.redirect('/log_in');
      return;
    }
    const passwordMatched = await bcrypt.compare(password, row.pwd);
    if (passwordMatched) {
      res.redirect('/home/'+row.uuid);
    } else {
      // add error message
      res.redirect('/log_in');
    }
  });
  db.close;
});

module.exports = router;