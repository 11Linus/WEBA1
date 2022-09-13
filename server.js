require('dotenv').config(); 

const exp = require("express");
const app = exp();
const cors = require("cors");

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();




app.use(exp.json())
app.use(cors());


app.get("/",function(req,res){
    res.json({msg:"API Listening"});
});

app.post("/api/movies",(req,res)=>{
   try{
    const temp =  db.addNewMovie(req.body);
    res.json(temp);
   }
   catch(err){
        res.status(500).send(err.message);
    }
});

app.get("/api/movies",(req,res)=>{
    db.getAllMovies(req.body.page, req.body.perPage, req.body.title).then(()=>{
        res.json(req.body);
    }).catch((err)=>{
      res.status(500).send("can't add");
    });
});

app.get("/api/movies",(req, res)=>{
    if (req.query.page || req.query.perPage) {
     try{
        const temp =  db.getAllMovies(req.query.page, req.query.perPage, req.query.title);
        res.json(temp);
     }
     catch (err){
        res.status(500).send(err.message);
     }
    } else {
      res.status(404).send(err.message);
    }
  });

app.get("/api/movies/:id",(req,res)=>{
    try{
        const temp = db.getMovieById(req.params.id);
        res.json(temp);
    }
    catch (err){
        res.status(204).send(err.message);
     }
});

app.put("/api/movies/:id",(req,res)=>{
    if(req.params.id != req.body){
        res.status(404).send(err.message);
    } else{
        const result = db.updateMovieById(req.body,req.params.id);
        if(result){
            res.json(result);
        } else{
            res.status(204).send(err.message);
        }
    }
});

app.delete("/api/movies/:id",(req,res)=>{
    if(req.params.id !== req.body){
        db.deleteMovieById(req.params.id).then(() => {
            res.status(201).json({ message: "deleted" });
          }).catch((err)=>{
            res.status(500).send(err.message);
          });
    } else{
        res.status(204).send(err.message);
    }
});

const HTTP_PORT = process.env.PORT || 8080;

//process.env.MONGODB_CONN_STRING
//var connectionString = "mongodb+srv://dbUser:Linus1234@senecaweb.3qtlrcl.mongodb.net/sample_mflix?retryWrites=true&w=majority";
//console.log(connectionString);
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});