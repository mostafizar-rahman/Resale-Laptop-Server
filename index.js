const express = require('express')
const app = express()
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oz1ak5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    const categoryCollection = client.db('resell_laptop').collection('category')
    const productsCollection = client.db('resell_laptop').collection('prodcts')
    const buyersCollection = client.db('resell_laptop').collection('buyers')
    const sellersCollection = client.db('resell_laptop').collection('sellers')
    
    try{

    }
    finally{

    }
}
run().catch(console.dir)


app.listen(port, ()=>{
    console.log('server is running')
})