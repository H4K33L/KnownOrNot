var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.get('/:id/:identityid/:reportid', async function(req, res, next) {
    const user_uuid = req.params.id;
    const identity_uuid = req.params.identityid;
    const report_uuid = req.params.reportid;
    const db = new sqlite3.Database('./BDD/db.sqlite');
    db.run("PRAGMA foreign_keys = ON;");
    await db.get("SELECT * FROM users WHERE uuid = ?", [user_uuid], async (err, row) => {
        if (err) {
          // add error message
          res.redirect('/');
          return;
        }
        db.all("SELECT * FROM reports WHERE identity_uuid = ? AND uuid = ?",[identity_uuid,report_uuid], (err, row) => {
            if (err) {
                // add error message
                res.redirect('/home/'+user_uuid);
                return;
            }
            res.render('report', {report : row[0]});
        });
    });
});

module.exports = router;