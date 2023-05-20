const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
require('dotenv').config()
app.get('/', (req, res) => {
    res.send('hello world')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5stkogd.mongodb.net/?retryWrites=true&w=majority"`

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
    // await client.connect();

//  const subCollection = client.db('subCategory').collection('subItems')
 const AllToysCollection = client.db('subCategory').collection('AllToysItems')

//  app.get('/subcategory_all', async(req, res) => {
//     const result = await subCollection.find().toArray()
//     res.send(result)
//  })

//  app.get('/subcategory_single/:id', async(req, res) => {
//     const id = req.body;
//     console.log(id)
//  })

//  Post data 
 app.post('/alltoys', async(req, res) => {
    const query = req.body;
    console.log(query)
    const result = await AllToysCollection.insertOne(query)
    res.send(result)
 })

// GET TOYS FROM TOYS COLLECTION 
app.get('/alltoys', async(req, res) => {
    const query = req.body;
    const result = await AllToysCollection.find({}).toArray()
    res.send(result)
})


app.get('/alltoys_text/:text', async(req, res) => {
  const doc = req.params.text;
  if(doc =='csd' || doc == 'afd' || doc == 'abd'){
    const result = await AllToysCollection.find({category: req.params.text}).toArray()
   return res.send(result)
  }
  
  const result = await AllToysCollection.find({}).toArray()
    res.send(result)
})

app.get('/alltoys_email/:email', async(req, res) => {
  console.log(req.params.email)
  const result = await AllToysCollection.find({email: req.params.email}).toArray()
  res.send(result)
})

app.get("/alltoys_one/:id", async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await AllToysCollection.findOne(query)
  res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('server in comming in port:', port)
})