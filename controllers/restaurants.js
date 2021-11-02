const Restaurant = require('../models/restaurant');
const categories = require('../models/category');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken}); 




module.exports.index = async (req, res) => {
    const { category, name, page } = req.query;
    var categoryCondition = category ? { category } : {};
    var nameCondition = name ? { name } : {};

    if(!req.query.page){
       const restaurants = await Restaurant.paginate(categoryCondition, nameCondition, {
        populate: {
            path: 'popupText'
        }
    });
    const categoryList = await categories.find({}); 
    res.render('restaurants/index', {restaurants,categoryList})
    } else {
        const {page}= req.query;
        const restaurants = await Restaurant.paginate(categoryCondition, nameCondition, {
            page,
            populate: {
                path: 'popupText'
            }
        });
        res.status(200).json(restaurants);
    }
} 

module.exports.AddNewForm = async(req, res) => {
    const restaurantList = await Restaurant.find();
    const categoryList = await categories.find({}); 
    restaurantList.forEach(()=>{

    })
    res.render('restaurants/new', {categoryList} );
}

module.exports.createRestaurant = async (req,res,next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.restaurant.location,
        limit:1
    }).send()
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.images=req.files.map(f => ({url: f.path, filename: f.filename}));

    restaurant.geometry = geoData.body.features[0].geometry;
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'You successfully added a new restaurant!')
    res.redirect(`/restaurants/${restaurant._id}`) 
}

module.exports.restaurantInfo = async (req,res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
            }
        }).populate('author');
    if(!restaurant){
        req.flash('error','Cannot find that restaurant');
        res.redirect('/restaurants');
    }

    const categoryList = await categories.find({});
    res.render('restaurants/show', {restaurant, categories});
}

module.exports.editForm=async(req,res) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id)
    if(!restaurant){
        req.flash('error','Cannot find that restaurant');
        return res.redirect('/restaurants');
    } 
    res.render('restaurants/edit', {restaurant})
}

module.exports.updateRestaurant = async (req,res) => {
    const {id} = req.params;
    const restaurant= await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
    const imgs =req.files.map(f => ({url: f.path, filename: f.filename}));
    restaurant.images.push(...imgs);
    await restaurant.save()
    req.flash('success', 'You successfully updated restaurant info');
    res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.deleteRestaurant = async (req,res) => {
    const {id} = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a restaurant');

    res.redirect('/restaurants')
}