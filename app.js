const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const Food = require("./models/foods");
const mongoose = require("mongoose");
const latlng = require("latitude-longitude");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/zilo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection  errrrrorrrr"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/foods/new", (req, res, next) => {
  res.render("foods/hack-revolution/new");
});

app.get("/foods/:id", async (req, res) => {
  const food = await Food.findById(req.params.id);
  res.render("foods/hack-revolution/show", { food });
});

app.get("/foods", async (req, res) => {
  // console.log(req.query);

  if (!req.query.name || req.query.name != "") {
    let foods = await Food.find({});
    if (req.query.food != undefined) {
      const opt = req.query.food.veg;

      if (opt != "both") {
        foods = await Food.find({ veg: req.query.food.veg }).sort({
          distance: 1,
        });
      } else {
        foods = await Food.find({ name: req.query.food.name });
      }
      res.render("foods/hack-revolution/index1", { foods });
    } else {
      foods = await Food.find({}).sort({ distance: 1 });
      res.render("foods/hack-revolution/index1", { foods });
    }
  } else {
    const foods = await Food.find(req.query);
    res.render("foods/hack-revolution/index1", { foods });
  }
});

app.delete("/foods/:id", async (req, res) => {
  const { id } = req.params;
  await Food.findByIdAndDelete(id);
  res.redirect(`/foods`);
});

app.get("/foods/:id/edit", async (req, res) => {
  const food = await Food.findById(req.params.id);
  res.render("foods/hack-revolution/edit", { food });
});

app.put("/foods/:id", async (req, res) => {
  const { id } = req.params;
  const food = await Food.findByIdAndUpdate(id, { ...req.body.food });
  res.redirect(`/foods/${food._id}`);
});

app.post("/foods", async (req, res) => {
  // console.log(req.body);
  const food = new Food(req.body.food);
  await food.save();
  res.redirect(`/foods/${food._id}`);
});

app.listen(8000, () => {
  console.log("Server is listening..at 8000");
});
