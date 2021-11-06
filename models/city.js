const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON : {virtuals:true}};

const citySchema = new Schema({
    city:String,
    lat:String,
    lng:String,
    country:String,
    iso2:String,
    admin_name:String,
    capital:String,
    population:String,
    population_proper:String
    
})

module.exports = mongoose.model("City",citySchema);

