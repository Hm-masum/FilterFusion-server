const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion} = require('mongodb');

const corsOptions={
    origin:['http://localhost:5173'],
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxuuz57.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    
    const productsCollection = client.db("FilterFusion").collection("products");

    app.post('/products',async(req,res)=>{
      const productsData = req.body;
      const result = await productsCollection.insertOne(productsData)
      res.send(result)
    })

    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('FilterFusion is coming')
})

app.listen(port,()=>{
    console.log(`server is running on port , ${port}`)
})
