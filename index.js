const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

/**
 * sudo pkill node = if the port is already been ...
 * 
 */



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req, res) => {
    //res.send('Working...');
    res.sendFile(__dirname + '/index.html');
})


const uri = "mongodb+srv://organicUser:habib390@cluster0.usac8.mongodb.net/organicdb?retryWrites=true&w=majority";
//if app crashes, change the password from database access - databaseuser - edit 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 const productCollection = client.db("organicdb").collection("products");
 
 app.get("/products",(req, res)=>{
   productCollection.find({})
   .toArray((err, documents) => {
     res.send(documents);
   })
 })
 


app.post("/addProduct",(req,res) => {
  const product = req.body;
  productCollection.insertOne(product)
  .then(() =>{
    console.log("data added successfully");
    res.redirect('/');
  })
 // console.log(product);

})
  console.log("Database connected successfully");
  // perform actions on the collection object
//client.close();

  app.get("/singleProduct/:id",(req, res)=>{
  productCollection.find({_id:ObjectId(req.params.id)})
  .toArray((err, documents) => {
  res.send(documents[0]);
  })
   })

app.patch("/update/:id",(req, res)=>{
  productCollection.updateOne({_id:ObjectId(req.params.id)}, 
  {
    $set: {price:req.body.price, quantity:req.body.quantity}
  })
  .then(result=>{
    console.log(result);
  })
})

app.delete("/delete/:id",(req, res)=>{
  console.log(req.params.id);
  productCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then((result)=>{
    console.log(result.deletedCount);
    res.send(result.deletedCount>0);
    
  })
})
});



app.listen(3000);