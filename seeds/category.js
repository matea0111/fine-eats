const mongoose = require('mongoose');
const category = require('../models/category');


mongoose.connect('mongodb://localhost:27017/fine-eats', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const categories = [
    'Chinese',
    'Vegeterian',
    'Indian',
    'Fast food',
    'Grill',
    'Local food',
    'Brunch',
    'Mexican'
]

const seedDB= async() => {
    await category.deleteMany({});

    for(const i in categories){
    const c = new category(
        {
         name: categories[i]   
        })
    await c.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})



