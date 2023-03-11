const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

//removeing date connection since printing Today hardcoded
// const date = require(__dirname + "/date.js"); //include the other module
 
const ejs = require('ejs');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine",'ejs');

mongoose.set('strictQuery', true); //tp avaoid deprecation warning
mongoose.connect("mongodb+srv://Rekha:Rekha13@cluster0.uihvcdf.mongodb.net/todoListDB", {useNewUrlParser: true}, (err) => {
    if(err) console.log('Unable to connect to the mongoDB server. Error:', err); 
    else console.log("mongdb is connected");
   });

//    const todolistSchema = new mongoose.Schema({
//     name:String
//    })

const todolistSchema = {
    name:String
}

const Item = mongoose.model("Item", todolistSchema);

const item1 = new Item({
    name:"Welcome to your todo list"
});

const item2 = new Item({
    name:"Hit + button to add a new item"
});

const item3 = new Item({
    name:"Select checkbox to delete item"
});

const defaultlist = [item1, item2, item3];

//for customistname
const ListSchema = {
    name:String,
    items: [todolistSchema]
}

const List = mongoose.model("List", ListSchema);


// Item.insertMany(arr, function(err){
//     if(err) console.log("unable to insert arr items", err);
//     else console.log("insertion done");
// }) //commented to avoid adding everytime the serer restarts

// let item = "rekha";
// let theday = '';

// let today = day.getDay();

// console.log(today);
// const addeditems = ["Food", "water"]; will be using from DB
// const workItems= [];


app.get("/", function(req, res){
    // res.send("hi");
    // res.render("trialejsapp");
    
    /*const day = new Date();  
    const options = { weekday: 'long', month: 'short', day: 'numeric'};

    theday = day.toLocaleDateString("en-US", options);
   */// written in Date.js
//    theday = date.getDay(); direct print today
//res.render("trialejsapp", {listTitle: theday , addeditem: addeditems}); commented to get data from DB
   
    // res.render('trialejsapp', {name:item});
    // res.render("trialejsapp", {thisday: theday, addeditem: newlyaddeditem});
    //founded items in foundItems, findall
   Item.find({}, function(err, foundItems){ 
    if (foundItems.length === 0){      
        Item.insertMany(defaultlist, function(err){
            if(err) console.log("unable to insert arr items", err);
            else console.log("insertion done");
        });
        res.redirect("/");
    }
    else 
             res.render("trialejsapp", {listTitle: "Today", addeditem: foundItems});
    });   
});

app.post("/", function(req, res){
//    console.log(req.body);
    // console.log(req.body.newitem);
    /*let newlyaddeditem = req.body.newitem;//input text, btnlist is name of button
    if(req.body.btnlist == "Work-list"){

        workItems.push(newlyaddeditem);
        res.redirect("/work");
    }
   else{
        addeditems.push(newlyaddeditem);
        res.redirect("/");
   }*/
   const newlyaddeditem = req.body.newitem; //input value
   const listname =  req.body.btnlist; //to take user entered url param using name of button value
//adding to db
   const newItem =  Item({  
    name:newlyaddeditem
   });
 
   if(listname === "Today"){
       newItem.save(); //save single record instead of insert many or other method
       res.redirect("/");
    }
   else{
        List.findOne({name : listname}, function(err, foundItems){ //user entered param will be seached in db
            // console.log(foundItems);
            if(err) console.log(err);
            else{
                foundItems.items.push(newItem);
            foundItems.save();s
            res.redirect("/"+ listname); 
            }       
        });
   }
});

app.post("/delete", function(req, res){
    // console.log(req.body.checkedbox); //to find chcked item
    const checkitemId = req.body.checkedbox;
    const listnameC = req.body.listNameC;   //from input hidden

    if( listnameC === "Today"){
        Item.findByIdAndRemove(checkitemId , function(err){
            if(err) console.log("can't remove from db");
            else console.log("removed");
        });
        res.redirect("/");
    }
    else{ //we can use for loop to delete but pull is easy way
        List.findOneAndUpdate({ name: listnameC },{$pull: {items: { _id: checkitemId }}}, function(err, findlist){
            if(!err) 
                res.redirect("/" + listnameC);
        });
    }

});

// app.get ("/work", function(req, res){
//     res.render("trialejsapp", {listTitle: "Work-list", addeditem: workItems});
// }) //commented to use routing params

app.get("/:customeListName", function(req,res){
    // console.log(req.params.customeListName);
    const customListedName = _.capitalize(req.params.customeListName);
   
    //find the name of item which user enters in url
    List.findOne( {name: customListedName}, function(err, foundItems){
        if(!err){
            if(!foundItems){
                // console.log("doesn't exists");
                 //create new list
                 const list = new List({
                    name:customListedName,
                    items : defaultlist
                });
                list.save();
                res.redirect("/" + customListedName);
            }
            else{
                // console.log("exists")
                //show an existing list
                res.render("trialejsapp", {listTitle: foundItems.name, addeditem: foundItems.items});
            }
        }
    });
});

app.get("/about", function(req, res){
    res.render("about");
})

// app.post("/work", function(req, res){
//     let items = res.body.newitem;
//     workItems.push(items);
//     res.redirect("/work");
// })

let port = process.env.PORT;
if(port == null ||port == ""){
    port =3000;
}
app.listen(port);

app.listen(port, function(){
        console.log("server running suucessfullly");
    });


//only for local
// app.listen(3000, function(){
//     console.log("server running on 3000");
// });