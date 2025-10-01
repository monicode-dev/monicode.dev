const { Sequelize, TEXT, INTEGER } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "databases/mcd.sqlite",
    logging: false
});

const recommends = sequelize.define("recommends", {
    category: {
        type: TEXT,
        allowNull: false,
    },
    name: {
        type: TEXT,
        allowNull: false
    },
    creator: {
        type: TEXT,
        allowNull: false
    },
    recommendedBy: {
        type: TEXT,
        allowNull: false
    },
})

const reviews = sequelize.define("reviews", {
    category: {
        type: TEXT,
        allowNull: false,
    },
    name: {
        type: TEXT,
        allowNull: false
    },
    creator: {
        type: TEXT,
        allowNull: false
    },
    review: {
        type: INTEGER,
        allowNull: false
    },
})

sequelize.sync()

module.exports = { sequelize, recommends, reviews }
