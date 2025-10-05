// deno-lint-ignore-file no-explicit-any prefer-const
// @ts-types="@types/express"
import express from "express";
const router = express.Router();

import { recommends, reviews } from "./databaseHandler.ts";
import { Model, ModelCtor } from "sequelize";

const CATEGORIES: string[] = [
    "music",
    "games",
    "moviesAndShows",
    "videos",
    "anime",
    "books",
];

function getData(model: ModelCtor<Model<any, any>>) {
    let data: any[] = [];

    model.findAll().then((rows) => {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i].dataValues;

            delete row.id;
            delete row.category;
            delete row.createdAt;
            delete row.updatedAt;

            data.push(row);
        }
    });

    return data;
}

function getDataByCategory(model: ModelCtor<Model<any, any>>, category: string) {
    let data: any[] = [];

    model.findAll({ where: { category: category } }).then((rows) => {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i].dataValues;

            delete row.id;
            delete row.category;
            delete row.createdAt;
            delete row.updatedAt;

            data.push(row);
        }
    });

    return data;
}

function deleteData(model: ModelCtor<Model<any, any>>, playload: { category: string; name: any }, token: string) {
    let errorFlag = false;

    errorFlag = errorFlag || !CATEGORIES.includes(playload.category);

    if (!Deno.env.has("TOKEN") || token != Deno.env.get("TOKEN")) {
        return 401;
    } else if (!playload.name || errorFlag) {
        return 400;
    } else {
        model.destroy({
            where: { category: playload.category, name: playload.name },
        });
        return 204;
    }
}

router.get("/recommends", (_req, res) => {
    res.json(getData(recommends));
});

router.get("/recommends/:category", (req, res) => {
    if (CATEGORIES.includes(req.params.category)) {
        res.json(getDataByCategory(recommends, req.params.category));
    } else {
        res.status(400).send();
    }
});

router.post("/recommends/:category", (req, res) => {
    let errorFlag = false;

    let playload = req.body;
    playload.category = req.params.category;

    ["category", "name", "creator", "recommendedBy"].forEach((key) => {
        // deno-lint-ignore no-prototype-builtins
        if (!playload.hasOwnProperty(key)) errorFlag = true;
    });

    errorFlag = errorFlag || !CATEGORIES.includes(playload.category);

    if (!errorFlag) {
        recommends.create(playload).then((_) => {
            res.status(201).send();
        });
    } else {
        res.status(400).send();
    }
});

router.delete("/recommends/:category", (req, res) => {
    let playload = req.body;
    playload.category = req.params.category;

    if (!req.headers.authorization) {
        res.status(401).send();
    } else {
        res.status(
            deleteData(reviews, playload, req.headers.authorization.split(" ")[1]),
        ).send();
    }
});

router.get("/reviews", (_req, res) => {
    res.json(getData(reviews));
});

router.get("/reviews/:category", (req, res) => {
    if (CATEGORIES.includes(req.params.category)) {
        res.json(getDataByCategory(reviews, req.params.category));
    } else {
        res.status(400).send();
    }
});

router.post("/reviews/:category", (req, res) => {
    let errorFlag = false;

    let playload = req.body;
    playload.category = req.params.category;

    ["category", "name", "creator", "review"].forEach((key) => {
        // deno-lint-ignore no-prototype-builtins
        if (!playload.hasOwnProperty(key)) errorFlag = true;
    });

    errorFlag = errorFlag || !CATEGORIES.includes(playload.category);

    if (
        !Deno.env.has("TOKEN") || !req.headers.authorization ||
        req.headers.authorization.split(" ")[1] != Deno.env.get("TOKEN")
    ) {
        res.status(401).send();
    } else if (errorFlag || typeof playload.review != "number") {
        res.status(400).send();
    } else {
        reviews.create(playload).then((_) => {
            res.status(201).send();
        });
    }
});

router.delete("/reviews/:category", (req, res) => {
    let playload = req.body;
    playload.category = req.params.category;

    if (!req.headers.authorization) {
        res.status(401).send();
    } else {
        res.status(
            deleteData(reviews, playload, req.headers.authorization.split(" ")[1]),
        ).send();
    }
});

export default router;
