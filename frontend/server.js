const express = require("express");
const path = require("path");

const app = express();

// pug views
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// home
app.get("/", (req, res) => {
        res.render("index", { message: "we'd like to introduce you to you." });
});

// start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Frontend running at http://localhost:${PORT}`);
});
