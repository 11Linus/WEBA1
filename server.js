/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Kin Lok Chan Student ID: 119293215 Date: 9/13/2022
*  Cyclic Link: https://dizzy-dove-peplum.cyclic.app
*
********************************************************************************/ 

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const dotenv = require('dotenv').config();
const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Listening' });
});

app.post("/api/movies", (req, res) => {
    res.status(201).json(db.addNewMovie(req.body))
})

app.get("/api/movies", (req, res) => {
    let page = req.query.page;
    let perPage = req.query.perPage;
    let title = req.query.title;

    db.getAllMovies(page, perPage, title).then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json({});
        });
})

app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id).then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Something went wrong, please try again ${err}'
            });
        });
});

app.put("/api/movies/:id", (req, res) => {
    db
        .updateMovieById(req.body, req.params.id)
        .then((data) => {
            res.status(204).json({message: data});
        })
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong, please try again ${err}' });
        });
});

app.delete("/api/movies/:id", (req, res) => {
    db
        .deleteMovieById(req.params.id)
        .then((data) => {
            res.status(201).json( {message: data });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Something went wrong, please try again ${err}'
            });
        });
});

app.use((req, res) => {
    res.status(204).send("Resource not found");
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
