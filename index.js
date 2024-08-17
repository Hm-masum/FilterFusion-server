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

    app.get('/all-products',async (req,res)=>{
      const search=req.query.search;
      const brand = req.query.brand;
      const category = req.query.category;
      const price = req.query.price;
      const sort = req.query.sort;
      let page = req.query.page;
      page=parseInt(page);
      const size = 5;

      let query={}
      let sortItem={}

      if(search){
        query.name ={$regex:search,$options:'i'}
      }

      if(brand && brand !== "all"){
        query.brand = {$regex:brand,$options:'i'};
      }

      if(category && category !== 'all'){
        query.category = {$regex:category,$options:'i'};
      }

      if (price && price !== "all") {
        if (price === "low") {
          query.price = { $lte: 500 };
        } else if (price === "mid") {
          query.price = { $gt: 500, $lte: 1000 };
        } else if (price === "high") {
          query.price = { $gt: 1000 };
        }
      }

      if(sort && sort !== 'all'){
        if(sort === 'lowToHigh'){
          sortItem.price = 1;
        }
        else if(sort === 'highToLow'){
          sortItem.price = -1;
        }
        else if(sort === 'newestDate'){
          sortItem.created_date = -1;
        }
        else if(sort === 'lowestDate'){
          sortItem.created_date = 1;
        }
      }
      
      const count = await productsCollection.countDocuments(query);

      const result= await productsCollection
        .find(query)
        .sort(sortItem)
        .skip(page * size)
        .limit(size)
        .toArray();

      res.send({result,count})
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
