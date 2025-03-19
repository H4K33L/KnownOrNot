var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

router.get('/:id', async function(req, res, next) {
    const user_uuid = req.params.id;
    const db = new sqlite3.Database('./BDD/db.sqlite');
    db.run("PRAGMA foreign_keys = ON;");
    await db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], async (err, row) => {
        if (err) {
          // add error message
          res.redirect('/');
          return;
        }
        db.all("SELECT * FROM identitys WHERE user_uuid = ?",[user_uuid],(err, rows) => {
            if (err) {
                // add error message
                res.redirect('/');
                return;
            }
            var getColorStyle = function getColorStyle(identity) {
                const now = new Date();
                const lastTimeDate = new Date(identity.last_report);
                const diffDays = Math.floor((now - lastTimeDate) / (1000 * 60 * 60 * 24));
                return diffDays > 7 ? 'color: red;' : 'color: green;';
            };
            res.render('home', {conected : true, uuid : row.uuid, name : row.name, email : row.email, identitys : rows, getColorStyle : getColorStyle});
        });
    });
});

router.post('/update/:id', async function(req, res, next) {
    const user_uuid = req.params.id;
    const {username, email, newpassword, confirm_newpassword, password } = req.body;
    const db = new sqlite3.Database('./BDD/db.sqlite');
    await db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], async (err, row) => {
    if (err || row === undefined) {
      // add error message
      res.redirect('/');
      return;
    }
    const passwordMatched = await bcrypt.compare(password, row.pwd);
        if (passwordMatched) {
            if (newpassword == "" || confirm_newpassword == "") {
                await db.run("UPDATE users SET name = ?, email = ? WHERE uuid = ?", [username, email, user_uuid], function(err) {
                    if (err) {
                        // add error message
                        res.redirect('/home/'+row.uuid);
                    }
                  });
            } else if (newpassword == confirm_newpassword ) {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(newpassword, salt);
                await db.run("UPDATE users SET name = ?, email = ?, pwd = ? WHERE uuid = ?", [username, email, hashedPassword, user_uuid], function(err) {
                    if (err) {
                        // add error message
                        res.redirect('/home/'+row.uuid);
                    }
                });
            } else {
                // add error message
                res.redirect('/home/'+row.uuid);
            }
        } else {
            // add error message
            res.redirect('/home/'+row.uuid);
        }
        res.redirect('/home/'+row.uuid);
        await db.close;
    });
});

router.post('/delete/:id', async function(req, res, next) {
    const user_uuid = req.params.id;
    const { password } = req.body;
    const db = new sqlite3.Database('./BDD/db.sqlite');
    db.run("PRAGMA foreign_keys = ON;");
    await db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], async (err, row) => {
    if (err || row === undefined) {
      // add error message
      res.redirect('/');
      return;
    }
    const passwordMatched = await bcrypt.compare(password, row.pwd);
        if (passwordMatched) {
            try {
                await db.run("DELETE FROM users WHERE uuid = ?", [user_uuid]);
            } catch (err) {
                //res.status(500).json({ error: "Failed to delete user" });
                res.redirect('/home/'+row.uuid);
                db.close;
            }
        } else {
            res.redirect('/home/'+row.uuid);
            db.close;
        }
        await res.redirect('/');
        await db.close;
    });
});

router.post('/create_identity/:id', async function(req, res, next) {
    const user_uuid = req.params.id;
    const { username, email, password } = req.body;
    const db = new sqlite3.Database('./BDD/db.sqlite');
    db.run("PRAGMA foreign_keys = ON;");
    await db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], async (err, row) => {
        if (err || row === undefined) {
        // add error message
        res.redirect('/');
        return;
        }
        var identity_uuid = uuidv4();
        const salt = await bcrypt.genSalt();
        console.log(salt,password,email, username);
        const hashedPassword = await bcrypt.hash(password, salt);
        await db.run("INSERT INTO identitys (uuid,user_uuid,name,email,pwd) VALUES (?,?,?,?,?)", [identity_uuid, user_uuid, username, email, hashedPassword], function(err) {
            if (err) {
                // add error message
                res.redirect('/home/'+row.uuid);
            }
            res.redirect('/home/'+row.uuid);
        });
        await db.close;
    });
});

router.post('/delete_identity/:id/:identityid', async function(req, res, next) {
    const user_uuid = req.params.id;
    const identity_uuid = req.params.identityid;
    const db = new sqlite3.Database('./BDD/db.sqlite');
    db.run("PRAGMA foreign_keys = ON;");
    await db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], async (err, row) => {
        if (err || row === undefined) {
        // add error message
        res.redirect('/');
        return;
        }
        try {
            await db.run("DELETE FROM identitys WHERE uuid = ?", [identity_uuid]);
        } catch (err) {
            //res.status(500).json({ error: "Failed to delete user" });
            res.redirect('/home/'+row.uuid);
            db.close;
        }
        res.redirect('/home/'+row.uuid);
        await db.close;
    });
});

module.exports = router;