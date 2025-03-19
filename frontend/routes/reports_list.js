var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

router.get('/:id/:identityid', async function(req, res, next) {
    const user_uuid = req.params.id;
    const identity_uuid = req.params.identityid;
    const db = new sqlite3.Database('./BDD/db.sqlite');
    db.run("PRAGMA foreign_keys = ON;");
    await db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], async (err, row) => {
        if (err) {
          // add error message
          res.redirect('/');
          return;
        }
        db.all("SELECT * FROM reports WHERE identity_uuid = ?",[identity_uuid], (err, rows) => {
            if (err) {
                // add error message
                res.redirect('/home/'+user_uuid);
                return;
            }
            res.render('reports_list', {conected : true, uuid : user_uuid, identity_uuid : identity_uuid, reports : rows});
        });
    });
});

router.post('/create_report/:id/:identityid', async function(req, res, next) {
    const user_uuid = req.params.id;
    const identity_uuid = req.params.identityid;
    const db = new sqlite3.Database('./BDD/db.sqlite');

    try {
        // Enable foreign key constraints
        await new Promise((resolve, reject) => {
            db.run("PRAGMA foreign_keys = ON;", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Check if user exists
        const user = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!user) {
            return res.redirect('/');
        }

        // Get identity information
        const identity = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM identitys WHERE uuid = ?", [identity_uuid], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!identity) {
            return res.redirect('/home/' + user_uuid);
        }

        // API call
        const apiUrl = `http://127.0.0.1:5000/osint_report?username=${identity.name}&email=${identity.email}&password=${identity.pwd}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const report_uuid = uuidv4();
        const password_sentence = data.password_check.message;
        const password_status = data.password_check.password_status;
        const holehe = data.holehe.holehe_results;

        // Insert report
        await new Promise((resolve, reject) => {
            db.run("INSERT INTO reports (uuid,identity_uuid,password_sentece,password_status,holehe,date) VALUES (?,?,?,?,?,datetime('now'))", 
                [report_uuid, identity_uuid, password_sentence, password_status, holehe], 
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Update identity
        await new Promise((resolve, reject) => {
            db.run("UPDATE identitys SET last_report = datetime('now') WHERE uuid = ?",
                [identity_uuid], 
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.redirect('/reports_list/' + user_uuid + '/' + identity_uuid);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    } finally {
        // Close the database connection
        db.close((err) => {
            if (err) console.error('Error closing database:', err);
        });
    }
});


router.post('/delete_report/:id/:identityid/:report_uuid', async function(req, res, next) {
    const user_uuid = req.params.id;
    const identity_uuid = req.params.identityid;
    const report_uuid = req.params.report_uuid;
    const db = new sqlite3.Database('./BDD/db.sqlite');
    db.run("PRAGMA foreign_keys = ON;");
    await db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], async (err, row) => {
        if (err || row === undefined) {
        // add error message
        res.redirect('/');
        return;
        }
        db.all("SELECT * FROM identitys WHERE uuid = ?",[identity_uuid], async (err, rows) => {
            if (err) {
                // add error message
                res.redirect('/home/'+user_uuid);
                return;
            }
            
            try {
                db.run("DELETE FROM reports WHERE uuid = ?", [report_uuid]);
            } catch (err) {
                //res.status(500).json({ error: "Failed to delete user" });
                res.redirect('/reports_list/'+user_uuid+'/'+identity_uuid);
                db.close;
            }
            res.redirect('/reports_list/'+user_uuid+'/'+identity_uuid);
            await db.close;
        });
    });
});

module.exports = router;