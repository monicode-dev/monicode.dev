const express = require("express");
const handlebars = require("express-handlebars");
const path = require("node:path");

const app = express();

const hbs = handlebars.create({
	extname: ".hbs",
	helpers: {
		css(aString) {
			return `css/${aString}-css`;
		},
		prettyBlogName(blogId, options) {
			if (options.blogName) {
				return options.blogName;
			} else {
				return blogId.split("-").map(function (word) {
					return word[0].toUpperCase() + word.substr(1);
				}).join(" ");
			}
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

app.get("/setup", (req, res) => {
	res.render("setup", {
		pageName: "Setup",
		pageId: "setup",
	});
});

app.get("/blogs", (req, res) => {
	res.render("blogs", {
		pageName: "Blogs",
		pageId: "blogs",
	});
});

app.get("/blogs/:blogId", async (req, res) => {
	const template = (await hbs.getTemplates("./views"))["blogs/" + req.params.blogId + ".hbs"]
	if (template) {
		let options = {
			blogId: req.params.blogId,
			layout: "blog-page",
		}
		
		if (options.blogId === "_template") options.blogName = "Template Blog"
		if (options.blogId === "home-dlc") options.blogName = "The Home Page DLC"

		res.render("blogs/" + req.params.blogId, options);
	} else {
		res.redirect("/blogs");
	}
});

app.get("/projects", (req, res) => {
	res.render("projects", {
		pageName: "Projects",
		pageId: "projects",
	});
});

app.get("/feed.xml", (req, res) => {
	const options = {
		root: path.join(__dirname),
	};

	res.sendFile("static/feed.xml", options);
});

app.use((req, res) => {
	res.redirect("/");
});

app.listen(1100, () => {
	console.log("Server up! Visit https://monicode.dev/");
});
