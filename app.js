const express = require("express");
const bodyParser = require("body-parser");

const date = require(__dirname + "/date.js"); //include the other module
 


const ejs = require('ejs');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine",'ejs');

// let item = "rekha";
let theday = '';

// let today = day.getDay();

// console.log(today);
const addeditems = ["Food", "water"];
const workItems= [];


app.get("/", function(req, res){
    // res.send("hi");
    // res.render("trialejsapp");
    
    /*const day = new Date();  
    const options = { weekday: 'long', month: 'short', day: 'numeric'};

    theday = day.toLocaleDateString("en-US", options);
   */// written in Date.js
   theday = date.getDay();
    res.render("trialejsapp", {listTitle: theday, addeditem: addeditems});
    // res.render('trialejsapp', {name:item});
    // res.render("trialejsapp", {thisday: theday, addeditem: newlyaddeditem});
})

app.post("/", function(req, res){
   console.log(req.body);
    // console.log(req.body.newitem);
    let newlyaddeditem = req.body.newitem;//input text, btnlist is name of button
    if(req.body.btnlist == "Work-list"){

        workItems.push(newlyaddeditem);
        res.redirect("/work");
    }
   else{
        addeditems.push(newlyaddeditem);
        res.redirect("/");
   }
   
 
     
})

app.get ("/work", function(req, res){
    res.render("trialejsapp", {listTitle: "Work-list", addeditem: workItems});
})

app.get("/about", function(req, res){
    res.render("about");
})

// app.post("/work", function(req, res){
//     let items = res.body.newitem;
//     workItems.push(items);
//     res.redirect("/work");
// })


app.listen(3000, function(){
    console.log("server running on 3000");
});