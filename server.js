const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const dbUrl = "mongodb://localhost:27017/robotData"
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectID;
const port = 3000;
const mustacheExpress = require('mustache-express');
const data = require('./data');
let DB;
let Robots;

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname, "./public")));

MongoClient.connect(dbUrl, (err, db) => {
    if (err) {
        return console.log("Error connecting to mongo", err);
    }
    DB = db;
    Robots = db.collection("robots");
});

// app.get("/insertRobots", (req, res) => {
//     Robots.insertMany(data.users, function (err, savedRobots) {
//         if (err) {
//             res.status(500).send(err);
//         }
//         res.send(savedRobots);
//     });
// });

app.get("/", (req, res) => {
    Robots.find({}).toArray((err, foundRobots) => {
        if (err) res.status(500).send(err);
        res.render("home", { users: foundRobots });
    });
});


app.get("/profile/:id", (req, res) => {
    Robots.findOne({ _id: ObjectId(req.params.id) }, function (err, foundRobot) {
        if (err) res.status(500).send(err);
        res.render("profile", { data: foundRobot });
    });
});

app.get("/forHire", (req, res) => {
    Robots.find({ job: null }).toArray((err, forHireBots) => {
        if (err) res.status(500).send(err);
        res.render("home", { users: forHireBots });
    });
});

app.get("/employed", (req, res) => {
    Robots.find({ job: { $ne: null } }).toArray((err, employedBots) => {
        if (err) res.status(500).send(err);
        res.render("home", { users: employedBots });
    });
});

app.listen(port, () => {
    console.log(`Welcome to port ${port}!`);
});


