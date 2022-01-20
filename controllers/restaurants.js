const Restaurant = require('../models/restaurant');
const Category = require('../models/category');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken}); 
const {cloudinary} = require("../cloudinary"); 
const restaurant = require('../models/restaurant');
const _ = require('lodash');




module.exports.index = async (req, res) => {
    const { category, name, rating, page } = req.query;
    var restaurantsAll= await Restaurant.find({});
    var categoryCondition = category ? { category } : {};
    var restaurantRating = rating ? { averageRating: {$gte: rating} } : {};
    var nameCondition = name ? {title: { $regex: new RegExp(name), $options: "i"  }} : {};
    var filter = !_.isEmpty(categoryCondition) ? categoryCondition : !_.isEmpty ( nameCondition) ? nameCondition : !_.isEmpty( restaurantRating) ? restaurantRating : {};
    if(!req.query.page){
        const restaurants = await Restaurant.paginate(filter, {
            populate: {
                path: 'popupText'
            }
        });
        const categoryList = await Category.find({}); 
        
        res.render('restaurants/index', {restaurants,categoryList,restaurantsAll});
    } else {
        const {page}= req.query;
        const restaurants = await Restaurant.paginate(filter, {
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
    const categoryList = await Category.find({}); 
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
    if (restaurant.images.length===0) {
        var nophoto = [
            {
              fieldname: 'image',
              originalname: 'no-foto.jpg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              path: 'https://res.cloudinary.com/dx4xgystc/image/upload/v1641505912/FineEats/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector_hkz8rc.webp',
              size: 103978,
              filename: 'FineEats/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector_hkz8rc.webp'
            }
          ];
          restaurant.images=nophoto.map(f => ({url: f.path, filename: f.filename}));
    }

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

    const categoryList = await Category.find({});
    res.render('restaurants/show', {restaurant, categoryList});
}

module.exports.editForm=async(req,res) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id)
    const categoryList = await Category.find({}); 

    if(!restaurant){
        req.flash('error','Cannot find that restaurant');
        return res.redirect('/restaurants');
    } 
    res.render('restaurants/edit', {restaurant,categoryList})
}

module.exports.updateRestaurant = async (req,res) => {
    const {id} = req.params;
    const restaurant= await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
    const imgs =req.files.map(f => ({url: f.path, filename: f.filename}));
    restaurant.images.push(...imgs);
    await restaurant.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await restaurant.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'You successfully updated restaurant info');
    res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.deleteRestaurant = async (req,res) => {
    const {id} = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a restaurant');

    res.redirect('/restaurants')
}