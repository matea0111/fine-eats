const mongoose = require('mongoose');
const gradovi = require('./gradovi');
const {descriptors } = require('./seedHelpers');
const Restaurant = require('../models/restaurant');
const Category = require('../models/category');


mongoose.connect('mongodb://localhost:27017/fine-eats', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});



const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB= async() => {
     const categoryList = await Category.find({}).select('name -_id');
    await Restaurant.deleteMany({});
    for(let i = 0 ; i < 15 ; i++){
        const rand100 = Math.floor(Math.random() * 100);
        const price=  Math.floor(Math.random() * 5) + 1;
        const city = [`${gradovi[rand100].city},  ${gradovi[rand100].country}`]
        const rest= new Restaurant({
            author:"60f4388e90987d34f8aceef4",
            location: `${gradovi[rand100].city}, ${gradovi[rand100].country}`,
            title: `${sample(descriptors)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum totam ducimus provident in sunt reiciendis nam beatae, cupiditate modi iure ratione. Deserunt sint, nobis quaerat nulla quis libero molestiae incidunt ',
            category: `${sample(categoryList).name}`,
            price,
            images: [
                {

                  url: 'https://res.cloudinary.com/dx4xgystc/image/upload/v1635006414/FineEats/bddzw1rbptmd8xtzjbmp.jpg',
                  filename: 'FineEats/bddzw1rbptmd8xtzjbmp'
                },
                {
                  url: 'https://res.cloudinary.com/dx4xgystc/image/upload/v1635006414/FineEats/bddzw1rbptmd8xtzjbmp.jpg',
                  filename: 'FineEats/bddzw1rbptmd8xtzjbmp'
                },
                {
                  url: 'https://res.cloudinary.com/dx4xgystc/image/upload/v1635006414/FineEats/bddzw1rbptmd8xtzjbmp.jpg',
                  filename: 'FineEats/bddzw1rbptmd8xtzjbmp'
                }
              ],
            geometry: {
                type: "Point",
                coordinates : [
                    gradovi[rand100].lng,
                    gradovi[rand100].lat
                ]
            },
         })
        await rest.save() 
        }
    
}

seedDB().then(() => {
    mongoose.connection.close();
})