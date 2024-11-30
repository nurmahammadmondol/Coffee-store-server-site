const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 1000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ackxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db('CoffeeShopDB');
    const CoffeeCollection = database.collection('coffee');

    app.get('/coffees', async (req, res) => {
      const coffees = CoffeeCollection.find();
      const result = await coffees.toArray();
      res.send(result);
    });

    app.get('/coffees/:id', async (req, res) => {
      const ID = req.params.id;
      const realID = { _id: new ObjectId(ID) };
      const result = await CoffeeCollection.findOne(realID);
      res.send(result);
    });

    app.post('/coffees', async (req, res) => {
      const AddCoffee = req.body;
      const result = await CoffeeCollection.insertOne(AddCoffee);
      res.send(result);
    });

    app.put('/coffees/:id', async (req, res) => {
      const ID = req.params.id;
      const filter = { _id: new ObjectId(ID) };

      const Coffee = req.body;
      const updateCoffee = {
        $set: {
          name: Coffee.name,
          chef: Coffee.chef,
          supplier: Coffee.supplier,
          price: Coffee.price,
          category: Coffee.category,
          details: Coffee.details,
          photo: Coffee.photo,
        },
      };

      const result = await CoffeeCollection.updateOne(filter, updateCoffee);
      res.send(result);
    });

    app.delete('/coffees/:id', async (req, res) => {
      const ID = req.params.id;
      // console.log(ID);
      const realID = { _id: new ObjectId(ID) };
      const result = await CoffeeCollection.deleteOne(realID);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hallo this is our coffee shop server site');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
