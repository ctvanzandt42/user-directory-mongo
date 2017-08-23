const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const dbUrl = "mongodb://localhost:12707/robotData"
const MongoClient = mongo.MongoClient;
const port = 3000;
const mustacheExpress = require('mustache-express');
const data = require('./data');

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname, "./public")));

let robots = data;
app.get("/insertMany", function (req, res) {
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            res.status(500).send(err);
        }

        let Robots = db.collection("robots");

        People.insertMany(people, function (err, savedRobots) {
            if (err) {
                res.status(500).send(err);
            }

            res.send(savedRobots);
            db.close();
        });
    });
});

app.get("/", (req, res) => {
    res.render('home', data);
});

app.get("/profile/:id", (req, res) => {
    let reqId = req.params.id;
    let foundUser = data.users.find(user => user.id == reqId);
    res.render('profile', { data: foundUser });
});

app.listen(port, () => {
    console.log(`Welcome to port ${port}!`);
});


