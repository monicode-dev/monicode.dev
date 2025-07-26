const express = require("express");
const handlebars = require("express-handlebars");

const app = express();

const hbs = handlebars.create({
	extname: ".hbs",
	helpers: {
		css(aString) {
			return `css/${aString}-css`;
		},
		prettyBlogName(aString) {
			return aString.toLowerCase().split("-").map(function (word) {
				return word[0].toUpperCase() + word.substr(1);
			}).join(" ");
		},
	},
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use("/css", express.static(__dirname + "/static/css"));
app.use("/js", express.static(__dirname + "/static/js"));
app.use("/images", express.static(__dirname + "/static/images"));

app.get("/", (req, res) => {
	res.render("home", {
		pageName: "Home",
		pageId: "home",
	});
});

app.get("/blogs", (req, res) => {
	res.render("blogs", {
		pageName: "Blogs",
		pageId: "blogs",
	});
});

app.get("/blogs/:blogName", async (req, res) => {
	if ((await hbs.getTemplates("./views"))["blogs/" + req.params.blogName + ".hbs"]) {
		res.render("blogs/" + req.params.blogName, {
			blogName: req.params.blogName,
			layout: "blog-page",
		});
	} else {
		res.redirect("/blogs")
	}
});

app.get("/projects", (req, res) => {
	res.render("projects", {
		pageName: "Projects",
		pageId: "projects",
	});
});

app.use((req, res) => {
	res.redirect("/");
});

app.listen(1100, () => {
	console.log("Sever up! Visit https://monicode.dev/");
});
