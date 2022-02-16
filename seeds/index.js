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




let restaurants = [];
let template = '[{_id:{$oid:61ca125dfc90253da09dcec5},geometry:{coordinates:[16.2217,43.4972],type:Point},reviews:[{$oid:61d738d4571bcf3c44689cfd},{$oid:61e0babb41d6c666c019c892},{$oid:61e4639850209119349bddc1},{$oid:61e9d5ca22827c19b0e3275c},{$oid:61e9d6d722827c19b0e3279e}],category:[Chinese],averageRating:4.25,author:{$oid:61e08fb69b439f3258675536},location:Okrug Gornji, Croatia,title:Full Moon,description:Savor a flavor at Full Moon, a brand-new local food restaurant in Okrug Gornji. Whether you\’re in the mood for something spicy or sweet, we\’ve got a huge range of authentic cuisine available on our menu—all deep fried to perfection. We\’re excited to bring something new to our community and can\’t wait to share our unique recipes.,price:3,images:[{_id:{$oid:61f06a051c7b764e2cf2a258},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1643145732/FineEats/jp71mdahqnbmx1mkuxib.jpg,filename:FineEats/jp71mdahqnbmx1mkuxib},{_id:{$oid:61f06a051c7b764e2cf2a259},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1643145732/FineEats/vrjvaexnzauvwio0rhii.jpg,filename:FineEats/vrjvaexnzauvwio0rhii},{_id:{$oid:61f06a051c7b764e2cf2a25a},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1643145732/FineEats/xgjemzz2zoiyr2xmk9yq.jpg,filename:FineEats/xgjemzz2zoiyr2xmk9yq}],__v:11,closingTime:23:21,openingTime:09:21,phoneNumber:091-123-4567}'+
'{geometry:{coordinates:[14.5056,45.3011],type:Point},category:[Chinese],averageRating:4,author:{$oid:61e08fb69b439f3258675536},location:Kostrena, Croatia,title:Catch of the Day,description:We believe in the commitment to our community and in fostering long term relationships with local farmers and fishermen. Our menus reflect these connections, featuring local, seasonal produce and sustainably sourced seafood and meats.  ,price:3,images:[{_id:{$oid:61ddf7346d51dc34fc0171a8},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936687/FineEats/vjzgr5hepzbfuyvmxsit.jpg,filename:FineEats/vjzgr5hepzbfuyvmxsit},{_id:{$oid:61ddf7346d51dc34fc0171a9},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936690/FineEats/cz6hmv6nzsmsgtfit57u.png,filename:FineEats/cz6hmv6nzsmsgtfit57u}],__v:6,closingTime:22:40,openingTime:11:52,phoneNumber:123123123}'+
'{geometry:{coordinates:[17.3833,45.8333],type:Point},category:[Chinese],averageRating:3.5,author:{$oid:61e08fb69b439f3258675536},location:Virovitica, Croatia,title:Parallel 37,description:Parallel 37 is a wine bar and restaurant for the curious—from casual drinkers to savvy connoisseurs. Our obsessively curated list and complementary food menu is designed to start a conversation, because there\’s really no wrong way to drink wine… except in bad company.  ,price:5,images:[{_id:{$oid:61ddf7816d51dc34fc0171c3},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936768/FineEats/rudkpfj9brjludktcwbj.jpg,filename:FineEats/rudkpfj9brjludktcwbj},{_id:{$oid:61ddf7816d51dc34fc0171c4},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936769/FineEats/bgh6jzpljktkaf6soamn.png,filename:FineEats/bgh6jzpljktkaf6soamn},{_id:{$oid:61defc0a9682284a9cab0ac8},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1642003467/FineEats/ghkdjr8jsdzfwvnjrnm5.jpg,filename:FineEats/ghkdjr8jsdzfwvnjrnm5}],__v:6,closingTime:09:00,openingTime:22:00,phoneNumber:123-456-789}'+
'{geometry:{coordinates:[17.3833,45.8333],type:Point},category:[Chinese],averageRating:3.5,author:{$oid:61e08fb69b439f3258675536},location:Virovitica, Croatia,title:Parallel 37,description:Parallel 37 is a wine bar and restaurant for the curious—from casual drinkers to savvy connoisseurs. Our obsessively curated list and complementary food menu is designed to start a conversation, because there\’s really no wrong way to drink wine… except in bad company.  ,price:5,images:[{_id:{$oid:61ddf7816d51dc34fc0171c3},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936768/FineEats/rudkpfj9brjludktcwbj.jpg,filename:FineEats/rudkpfj9brjludktcwbj},{_id:{$oid:61ddf7816d51dc34fc0171c4},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936769/FineEats/bgh6jzpljktkaf6soamn.png,filename:FineEats/bgh6jzpljktkaf6soamn},{_id:{$oid:61defc0a9682284a9cab0ac8},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1642003467/FineEats/ghkdjr8jsdzfwvnjrnm5.jpg,filename:FineEats/ghkdjr8jsdzfwvnjrnm5}],__v:6,closingTime:12:30,openingTime:23:00,phoneNumber:123-456-789}'+
'{geometry:{coordinates:[16.4831,43.5394],type:Point},category:[Chinese],averageRating:4,author:{$oid:61e08fb69b439f3258675536},location:Solin, Croatia,title:Proxi,description:Located at Solin. We offer a wide array of fresh food – green pork plate, chimichangas, hamburger, barbacoa plate, pizza, salads, bbq with rice and beans and more. We use the freshest ingredients in preparing our food to provide the best quality and taste. Try our delicious food today!         ,price:3,images:[{_id:{$oid:61ddf7a36d51dc34fc0171e7},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936802/FineEats/ezxvyg8i0o7jptpfthi2.jpg,filename:FineEats/ezxvyg8i0o7jptpfthi2},{_id:{$oid:61ddf7a36d51dc34fc0171e8},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936803/FineEats/yi2j4riiabzt2bnezpo3.jpg,filename:FineEats/yi2j4riiabzt2bnezpo3}],__v:11,closingTime:12:00,openingTime:00:00,phoneNumber:123-456-789}'+
'{geometry:{coordinates:[19.15,45.1667],type:Point},category:[Vegeterian],averageRating:3,author:{$oid:61e08fb69b439f3258675536},location:Tovarnik, Croatia,title:Daily Grill,description:We are a tight-knit, fun-loving, devoted team of local cooks spreading the gospel of good times and good food in Tovarnik.  We offer limited capacity onsite events in our restaurant kitchen space. And worry not, our krewe will travel to your destination of choice – from hotel ballrooms to private kitchens – to entertain groups of all sizes. We cook, we tell stories, we deliver informative culinary demonstrations and lectures, but most of all … we treat every event like you\’re a guest at our dinner table. Join us!,price:5,images:[{_id:{$oid:61ddf81a6d51dc34fc017213},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936921/FineEats/fghzjkxgaandjyljplpp.png,filename:FineEats/fghzjkxgaandjyljplpp},{_id:{$oid:61ddf81a6d51dc34fc017214},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936921/FineEats/mfnlf0eizmu2uc855s49.jpg,filename:FineEats/mfnlf0eizmu2uc855s49}],__v:6,closingTime:12:30,openingTime:23:00,phoneNumber:123-456-789}'+
'{geometry:{coordinates:[16.0911,45.3383],type:Point},category:[Grill],averageRating:0.1,author:{$oid:61e08fb69b439f3258675536},location:Glina, Croatia,title:The Local Eatery,description:The Local Eatery specializes in delicious food featuring fresh ingredients and masterful preparation by the The Local Eatery culinary team. Whether you\’re ordering a multi-course meal or grabbing a drink and pizza at the bar, The Local Eatery\'s lively, casual yet upscale atmosphere makes it perfect for dining with friends, family, clients and business associates.\r\n\r\n,price:4,images:[{_id:{$oid:61ddf8466d51dc34fc01722a},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1641936966/FineEats/xmjthz3qc1gjgu4u6set.jpg,filename:FineEats/xmjthz3qc1gjgu4u6set}],__v:3,closingTime:12:30,openingTime:23:00,phoneNumber:123-456-789}'+
'{geometry:{coordinates:[16.45,43.51],type:Point},category:[Indian],averageRating:2,author:{$oid:61e08fb69b439f3258675536},location:Split, Croatia,title:Burger & Beer Joint,description:Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum totam ducimus provident in sunt reiciendis nam beatae, cupiditate modi iure ratione. Deserunt sint, nobis quaerat nulla quis libero molestiae incidunt ,price:4,images:[{_id:{$oid:61ca125dfc90253da09dcee9},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1635006414/FineEats/bddzw1rbptmd8xtzjbmp.jpg,filename:FineEats/bddzw1rbptmd8xtzjbmp},{_id:{$oid:61ca125dfc90253da09dceea},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1635006414/FineEats/bddzw1rbptmd8xtzjbmp.jpg,filename:FineEats/bddzw1rbptmd8xtzjbmp},{_id:{$oid:61ca125dfc90253da09dceeb},url:https://res.cloudinary.com/dx4xgystc/image/upload/v1635006414/FineEats/bddzw1rbptmd8xtzjbmp.jpg,filename:FineEats/bddzw1rbptmd8xtzjbmp}],__v:2,closingTime:11:30,openingTime:21:00,phoneNumber:123-456-789}]'







































const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB= async() => {
     const categoryList = await Category.find({}).select('name -_id');
    await Restaurant.deleteMany({});
    for(let i = 0 ; i < 1 ; i++){
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