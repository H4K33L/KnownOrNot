var express = require('express');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
var router = express.Router();
const fs = require('fs').promises;

router.get('/', async function(req, res, next) {
  try {
    const data = await fs.readFile("config/terms_and_condition.txt", 'utf8');
    await res.render('sign_up', { title: 'knownornot', termsAndCondition : data});
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    res.render('sign_up', { title: 'knownornot', termsAndCondition : null});
  }
});

router.post('/', async function(req, res, next) {
  const {username, email, password, confirm_password} = req.body;
  var user_uuid = uuidv4();
  if (password == confirm_password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const db = new sqlite3.Database('./BDD/db.sqlite');
    await db.run("INSERT INTO users (uuid,name,email,pwd) VALUES (?,?,?,?)", [user_uuid, username, email, hashedPassword], function(err) {
      if (err) {
        // add error message
        return res.redirect('/sign_up');
      }
      res.redirect('/log_in');
    });
    await db.close;
  } else {
    // add error message
    res.redirect('/sign_up');
  }
});

module.exports = router;