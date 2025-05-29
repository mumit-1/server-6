const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5100;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yrnn1sn.mongodb.net/?appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("user");
    
    app.post('/coffee',async(req,res)=>{
      const newCoffee=req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })
    app.get('/coffee',async(req,res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    //Single data wise
    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })
    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })
    app.put('/coffee/:id',async(req,res)=>{
     const id = req.params.id;
     const filter = {_id: new ObjectId(id)};
     const options = { upsert: true };
     const updatedCoffee = req.body;
     const coffee = {
      $set: {
        name: updatedCoffee.name,
         chef: updatedCoffee.chef,
         supplier: updatedCoffee.supplier,
         taste: updatedCoffee.taste,
         category: updatedCoffee.category,
         details: updatedCoffee.details,
         photo: updatedCoffee.photo,
      },
    };
      const result = await coffeeCollection.updateOne(filter,coffee,options);
      res.send(result);
    })
    app.post("/user", async(req,res)=>{
      const userClient = req.body;
      console.log(userClient, " from server ");
      const result = await userCollection.insertOne(userClient);
      res.send(result);
    })
    app.get('/user',async(req,res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.delete('/user/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
    app.patch('/user', async(req,res)=>{
      const email = req.body.email;
      const filter = {email};
      const updateDoc = {
      $set: {
        lastLogged : req.body?.lastLogged
      }
    };
       const result = await userCollection.updateOne(filter, updateDoc);
       res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close() ;
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
 res.send("sucsexfull");
})
app.listen(port,()=>{
    console.log(`server-0n at ${port}`);
})

/**
 * firebase hosting------------------
 * 1 firebase tool (one time)
 * 2 firebase login (one time)
 * 3 onetime for each project : firebase init
 * 4 what yo want do : hosting 
 * 5 select project (already have in firebase console)
 * 6 what will be your public repo -- dist
 * 7 single page -- y
 * ## each time before deploying 
 * 8 npm run build 
 * 9 firebase deploy
 */