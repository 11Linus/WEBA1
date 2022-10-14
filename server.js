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

const express = require("express");
const cors = require("cors");
const config = require('dotenv').config();
let HTTP_PORT = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

const MoviesDB = require("./modules/moviesDB");
const db = new MoviesDB();

app.post("/api/movies", async (req, res) => {
    try {
        const data = req.body;
        const newMovie = await db.addNewMovie(data);
        if (!newMovie) throw new Error("Could not add movie");
        res.json(newMovie);
    } catch (err) {
        console.log("post /api/movies", err);
        res.status(500).json({});
    }
});

app.get("/api/movies", async (req, res) => {
    try {
        const page = req.query.page ?? 1;
        const perPage = req.query.perPage ?? 5;
        const title = req.query.title ?? undefined;
        const movies = await db.getAllMovies(page, perPage, title);
        res.json(movies);
    } catch (err) {
        console.log("get /api/movies", err);
        res.status(500).json([]);
    }
});

app.get("/api/movies/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await db.getMovieById(id);
        if (!movie) throw new Error("Could not get movie");
        res.json(movie);
    } catch (err) {
        console.log("get /api/movies/:id", req.params.id, err);
        res.status(500).json({});
    }
});

app.put("/api/movies/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedMovie = await db.updateMovieById(id, data);
        if (!updatedMovie) throw new Error("Could not update movie");
        res.json({
            success: true,
            data: updatedMovie,
        });
    } catch (err) {
        console.log("put /api/movies/:id", req.params.id, err);
        res.status(500).json({ success: false, message: "Could not update movie" });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.deleteMovieById(id);

        if (!result || !result.acknowledged) throw new Error("Could not delete movie");
        if (!result.deletedCount == 0) {
            res.json({ success: true, message: `Movie ${id} not exist` });
        } else {
            res.json({ success: true, message: `Movie ${id} deleted` });
        }
    } catch (err) {
        console.log("delete /api/movies/:id", req.params.id, err);
        res.status(500).json({ success: false, message: "Could not delete movie" });
    }
});

app.get("/", function (req, res) {
    res.json({ message: "API Listening" });
});

db.initialize(`mongodb+srv://dbUser:Linus1234@senecaweb.3qtlrcl.mongodb.net/sample_mflix?retryWrites=true&w=majority`).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
