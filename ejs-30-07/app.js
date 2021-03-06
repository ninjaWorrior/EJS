const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var multer =require('multer')
var upload =multer();

const app = express();
//
app.use(upload.array()); 
app.use(express.static('public'));
//
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

//
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb"
//
var day="Registration Form";
app.get("/", function(req, res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
      });
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mypug1");
        dbo.createCollection("customers", function(err, res) {
          if (err) throw err;
          console.log("Collection created!");
          db.close();
        });
      });
 res.render("index", {
   day: day
 } );
});

app.post('/',function(req,res,next)
{
    console.log(req.body.name);
    var email1=req.body.email;
    var pswd1 =req.body.pswd; 
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mypug1");
      var myobj = { name: req.body.name, email:req.body.email , password:req.body.pswd };
      dbo.collection("customers").find({email:email1,password:pswd1}).toArray(function(err, result) {
        if (err) throw err;
         if(result[0])
        {
          console.log("correct");
        }
       else{
        dbo.collection("customers").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
       }
      });
      
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mypug1");
        var mysort = { name: 1 };
        dbo.collection("customers").find().sort(mysort).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.render('register',{title:"Register candidate",p:JSON.stringify(result)})
          db.close();
        });
      });
    
    });
})


// login 
app.get('/login', function(req, res, next) { 
    var day="Registration Form";
    res.render('login',{
        day: day
      } ); 
  }); 

  // login post
  app.post('/login',function(req,res,next){
    var email=req.body.email;
    var pswd=req.body.pswd;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mypug1");
      dbo.collection("customers").find({email:email,password:pswd}).toArray(function(err, result) {
        if (err) throw err;
         if(result[0])
        {
          console.log("correct");
          res.render('register',{title:"Register candidate",p:JSON.stringify(result)})
        }
        else{
          res.render('register',{title:"Wrong information",p:"email-Id or password not match"})
        }
        db.close();
      });
    });
  
  })

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
