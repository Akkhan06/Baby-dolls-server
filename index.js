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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5stkogd.mongodb.net/?retryWrites=true&w=majority`

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

// DATA COLLECTION FUNCTION
 const AllToysCollection = client.db('subCategory').collection('AllToysItems')



//  POST DATA  
 app.post('/alltoys', async(req, res) => {
    const query = req.body;
    console.log('line 47',query)
    const result = await AllToysCollection.insertOne(query)
    res.send(result)
 })

// GET TOYS FROM TOYS COLLECTION 
app.get('/alltoys', async(req, res) => {
    const result = await AllToysCollection.find({}).toArray()
    res.send(result)
})


// SUB CATEGORY SHOW SUM DATA FUNCTION 
app.get('/alltoys_text/:text', async(req, res) => {
  const doc = req.params.text;
  if(doc =='csd' || doc == 'afd' || doc == 'abd'){
    const result = await AllToysCollection.find({category: req.params.text}).toArray()
   return res.send(result)
  }
  const result = await AllToysCollection.find({}).toArray()
    res.send(result)
})


// GET DATA BY EMAIL FUNCTION
app.get('/alltoys_email/:email', async(req, res) => {
  console.log(req.params.email)
  const result = await AllToysCollection.find({email: req.params.email}).toArray()
  res.send(result)
})


// DELETE ONE DATA FROM ALL DATA
app.delete('/alltoys_email/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await AllToysCollection.deleteOne(query)
  res.send(result)
})


// GET ONE DATA FROM ALL DATA
app.get("/alltoys_one/:id", async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await AllToysCollection.findOne(query)
  res.send(result)
})


// UPDATE ONE DATA FROM ONE DATA
app.put('/alltoys_one/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true }
  const updatedInfo = req.body;
  console.log("hello",updatedInfo)
  const updateDoc = {
    $set: {
      price: updatedInfo.price,
      quantity: updatedInfo.quantity,
      discription: updatedInfo.discription
    },
  };
  const result = await AllToysCollection.updateOne(filter, updateDoc, options);
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