const express = require("express");
const mongodb = require("mongodb");
const uri =
  "mongodb+srv://cyf:6Cd37enBZ2YsqfWj@cluster0.5kxur.mongodb.net/test";
const mongoOptions = { useUnifiedTopology: true };
const client = new mongodb.MongoClient(uri, mongoOptions);
const app = express();
app.use(express.json());


client.connect(function () {
  const db = client.db("mongodb-week-3");
  const collection = db.collection("movies");

  //get lists of films
  app.get("/films", function (request, response) {
    collection.find().toArray((error, results) => {
      if (error) {
        response.status(500).send(error);
      } else {
        response.status(200).send(results);
      }
    });
  });

  //get one film by ID
  app.get("/films/:id", function (request, response) {
    const {id} = request.params;
    let newId;
    if(mongodb.ObjectID.isValid(id)){
      newId = new mongodb.ObjectID(id);
      collection.findOne({_id:newId},(error,results) => {
        if(error){
          response.status(500).send(error);
        }
        else{
          response.send(results);
        }
      })
    }
    else{
      response.status(500).send("Id is not valid");
    }
  });
  
  // Create a film
  app.post("/films", function (request, response) {
    const newFilm = {
      title:request.body.title,
      year: request.body.year,
      actors: request.body.actors,
    }
    collection.insertOne(newFilm,(error,results) => {
      response.send(error || result);
    })
    response.send("Create a film");
  });
  
  //Upload a film
  app.put("/films/:id", function (request, response) {
    const {id} = request.params;
    const title = request.body.title;
    const year = request.body.year;
    const actors = request.body.actors;
    let newId;
    if(mongodb.ObjectID.isValid(id)){
      newId = new mongodb.ObjectID(id);
      const searchObject = {
       _id : newId
      };
      const updateObject = {
        $set: {
          title: title,
          year:year,
          actors:actors
        },
      };
      const options = { returnOriginal: false };
      if(title && year && actors && newId){
      collection.findOneAndUpdate(searchObject,updateObject,options,(error,result) => {
        if(error){
          response.send(error);
        }
        else{
          response.send(result.value);
        }
      })
     }
     else{
      response.send("Sorry something went wrong! please check your updating data");
     }
    }
    else{
      response.status(400).send("Sorry something went wrong!");
    }
  })
})
  
  // delete a film by ID
  app.delete("/films/:id", function (request, response) {
    const {id} = request.params;
    const searchObject = {_id:id}
    collection.deleteOne(searchObject,(error,results) => {
      if(error){
        response.status(500).send(error);
      }
      else if(results.deletedCount){
        response.status(204).send("It has been deleted")
      }
      else{
        response.sendStatus(404);
      }
      client.close();
    })
  });

  app.listen(3000);
