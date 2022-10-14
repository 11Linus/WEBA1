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
const app = express();

const cors = require("cors");
require('dotenv').config();


const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  // res.json({message: "API listening"});
  res.send(`
        <h2>Movies API</h2>
        <p>WEB422 Assignment 1 - 2227</p>
        <ul>
          <li>GetAll: 
            <ul><li><a href='/api/movies?page=1&perPage=5'>/api/movies?page=1&perPage=5</a></li>
                <li><a href='/api/movies?page=1&perPage=5&title=The Avengers'>/api/movies?page=1&perPage=5&title=The Avengers</a></li>
            </ul></li>
          <li>GetOne: <ul><li><a href='/api/movies/573a13a3f29313caabd0d5a4'>/api/movies/573a13a3f29313caabd0d5a4</a></li></ul> </li></ul>
        <p>URL on Cyclic</p>
        <ul><li><a href='https://gleaming-jade-newt.cyclic.app/'>https://gleaming-jade-newt.cyclic.app/</a></li></ul>`
    );

});

app.post("/api/movies", (req,res) => {
  db.addNewMovie(req.body)
      .then((movie) => {
          res.status(201).json(movie);
      }).catch((err) => {
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.get("/api/movies", (req, res) => {
  const { page, perPage, title } = req.query;

  db.getAllMovies(page, perPage, title)
    .then(data => {
      res.json(data);
    }).catch((err) => {
      res.status(500).json({ message: `an error occurred: ${err}` });
    });
}
);

app.get("/api/movies/:id",(req,res) => {
  db.getMovieById(req.params.id)
      .then(data => {
          res.json(data);
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.put("/api/movies/:id", (req,res) => {
  const id = req.params.id;

  db.updateMovieById(req.body, id)
      .then(() => {
          res.json({message: `movie ${id} successfully updated`});
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.delete("/api/movies/:id", (req,res)=>{
  db.deleteMovieById(req.params.id)
      .then(() => {
          res.status(204).end();
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.error(err);
});
