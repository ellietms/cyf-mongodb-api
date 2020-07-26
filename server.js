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

  app.get("/films", function (request, response) {
    collection.find().toArray((error, results) => {
      if (error) {
        response.status(500).send(error);
      } else {
        response.status(200).send(results);
      }
    });
  });

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

  app.post("/films", function (request, response) {
    response.send("Create a film");
  });

  app.put("/films/:id", function (request, response) {
    response.send("Update one film");
  });

  app.delete("/films/:id", function (request, response) {
    response.send("Delete one film");
  });

  app.listen(3000);
});
