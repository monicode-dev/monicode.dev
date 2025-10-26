// @ts-types="@types/express"
import express from "express";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

const app = express();

const hbs = handlebars.create({
    extname: ".hbs",
    helpers: {
        css(aString: string) {
            return `css/${aString}-css`;
        },
    },
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use((req, _res, next) => {
    const date = dayjs().utcOffset(0, false);
    const dateFormated = date.format("MM/DD/YYYY @ HH:mm");

    console.log(`[${dateFormated} UTC] ${req.method}: ${req.path}`);
    next();
});

app.use(bodyParser.json());
app.use(express.static(import.meta.dirname + "/static"));

app.use("/", express.static(import.meta.dirname + "/static"));

app.get("/", (_req, res) => {
    res.render("home", {
        pageName: "Home",
        pageId: "home",
    });
});

app.get("/setup", (_req, res) => {
    res.render("setup", {
        pageName: "Setup",
        pageId: "setup",
    });
});

app.get("/blogs", (_req, res) => {
    res.render("blogs", {
        pageName: "Blogs",
        pageId: "blogs",
    });
});

app.get("/blogs/:blogId", (req, res) => {
    try {
        Deno.statSync(import.meta.dirname + "/views/blogs");

        const options = {
            blogId: req.params.blogId,
            layout: "blog-page",
        };

        res.render("blogs/" + req.params.blogId, options);
    } catch {
        res.redirect("/blogs");
    }
});

app.get("/projects", (_req, res) => {
    res.render("projects", {
        pageName: "Projects",
        pageId: "projects",
    });
});

app.get("/recommends", (_req, res) => {
    res.render("recommends", {
        pageName: "Recommends",
        pageId: "recommends",
    });
});

app.use((_req, res) => {
    res.redirect("/");
});

app.listen(1100, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(
            "Server up! Visit https://monicode.dev/ | http://localhost:1100",
        );
    }
});
