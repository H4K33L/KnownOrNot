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
            
            var report_uuid = uuidv4();
            await db.run("INSERT INTO reports (uuid,identity_uuid,danger_indice) VALUES (?,?,?)", [report_uuid,identity_uuid,0], function(err) {
                if (err) {
                    // add error message
                    res.redirect('/reports_list/'+user_uuid+'/'+identity_uuid);
                }
                db.run("UPDATE identitys SET last_report = datetime('now') WHERE uuid = ?",[identity_uuid], function(err) {
                    if (err) {
                        // add error message
                        res.redirect('/reports_list/'+user_uuid+'/'+identity_uuid);
                    }
                  });
                res.redirect('/reports_list/'+user_uuid+'/'+identity_uuid);
            });
            await db.close;
        });
    });
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