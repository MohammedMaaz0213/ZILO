const mongoose = require('mongoose');
const Food = require('../models/foods');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/yelp-camp' ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error' ,     console.error.bind(console, "connection  errrrrorrrr"));
db.once("open",     ()=>{
    console.log("DATABASE CONNECTED");
})

const   sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await foods.deleteMany({});

    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const campground = new Campground({
            name: `${sample(descriptors)} ${sample(places)}`,
           
        }) 
        await campground.save();

    }
}   


seedDB().then(()=>{
    mongoose.connection.close();
});