const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
let ejs = require('ejs');
const port = 3000

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://'+process.env.MONGODB_USER+':'+process.env.MONGODB_PW+'@tdl1.jppfsml.mongodb.net/todolistDB');
};

const today = new Date();
const dateOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
};

const currentDay = today.toLocaleDateString('en-GB', dateOptions);

const itemsSchema = new mongoose.Schema ({
  name: String
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item ({
  name: "Welcome to your 'To-Do' list!"
});

const item2 = new Item ({
  name: "<-- Click here to delete an item"
});
 
const item3 = new Item ({
  name: "Click the '+' to add a new item"
});

const item4 = new Item ({
  name: "Click & drag to re-order the list"
});

const defaultItems = [item1, item2, item3, item4];

app.get("/", function(req, res) {
  const foundItems = Item.find({})
    .then(
      (foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
        res.redirect('/');
      } else { 
        res.render("list", {listTitle: currentDay, ListItems: foundItems});  
  }})
});

app.post('/', function(req, res) {
  const newItem = new Item({
    name: req.body.newItem
  });
  newItem.save();
  res.redirect('/');
});

app.post('/delete', function(req, res) {
  Item.findByIdAndDelete(req.body.checkbox)
  .then(setTimeout(function() {
    res.redirect('/')
  }, 1000));
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});


app.listen(port, function() {
  console.log("Server started on port " + port);
});
