const fs = require("node:fs");
const path = require("node:path");

const express = require("express");
const handlebars = require("express-handlebars")

const app = express()
const hbs = handlebars.create({
	extname: ".hbs"
})

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use('/css', express.static(__dirname + '/static/css'))
app.use('/images', express.static(__dirname + '/static/images'))

app.get("/", (req, res) => {
    res.render('home');
});

app.listen(5000, () => {
  	console.log("Sever up! Visit https://monicode.dev/")
})