const express = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const path = require("node:path");

const v1 = require("./api/v1.js");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

require("dotenv").config({ quiet: true });

dayjs.extend(utc);

const app = express();

const hbs = handlebars.create({
	extname: ".hbs",
	helpers: {
		css(aString) {
			return `css/${aString}-css`;
		},
	},
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use((req, res, next) => {
	let date = dayjs().utcOffset(0, false);
	let dateFormated = date.format("MM/DD/YYYY @ HH:mm");

	console.log(`[${dateFormated} UTC] ${req.method}: ${req.path}`);
	next();
});

app.use(bodyParser.json());
app.use(express.static(__dirname + "/static"));

app.use("/css", express.static(__dirname + "/static/css"));
app.use("/js", express.static(__dirname + "/static/js"));
app.use("/images", express.static(__dirname + "/static/images"));

app.use("/v1", v1);

app.get("/feed.xml", (req, res) => {
	const options = {
		root: path.join(__dirname),
	};

	res.sendFile("static/feed.xml", options);
});

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
	const template = (await hbs.getTemplates("./views"))[
		"blogs/" + req.params.blogId + ".hbs"
	];
	if (template) {
		let options = {
			blogId: req.params.blogId,
			layout: "blog-page",
		};

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

app.get("/recommends", (req, res) => {
	res.render("recommends", {
		pageName: "Recommends",
		pageId: "recommends",
	});
});

app.get("/rec-form", (req, res) => {
	if (req.query["category"] != undefined) {
		if (req.query["yourName"] == "") {
			req.query["yourName"] = "Anonymous";
		}
		console.log(req.query["yourName"] == "");

		res.send(req.query);
	} else {
		res.render("rec-form", {
			pageName: "Recommendation Form",
			pageId: "rec-form",
			layout: "form",
		});
	}
});

app.get("/reviews", (req, res) => {
	res.render("reviews", {
		pageName: "Reviews",
		pageId: "reviews",
	});
});

app.use((req, res) => {
	res.redirect("/")
});

app.listen(1100, (err) => {
	if (err) {
		console.error(err)
	} else {
		console.log("Server up! Visit https://monicode.dev/ | http://localhost:1100");
	}
});
