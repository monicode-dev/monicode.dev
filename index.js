const express = require("express");
const handlebars = require("express-handlebars")

const app = express()
const hbs = handlebars.create({
	extname: ".hbs",
	helpers: {
		css(aString) { return `css/${aString}-css` }
	}
})

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use('/css', express.static(__dirname + '/static/css'))
app.use('/images', express.static(__dirname + '/static/images'))

app.get("/", (req, res) => {
    res.render('home', {
		pageName: "Home",
		pageId: "home"
	});
});

app.get("/blogs", (req, res) => {
    res.render('blogs', {
		pageName: "Blogs",
		pageId: "blogs"
	});
});

app.get("/projects", (req, res) => {
    res.render('projects', {
		pageName: "Projects",
		pageId: "projects"
	});
});

app.listen(5000, () => {
  	console.log("Sever up! Visit https://monicode.dev/")
})