const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


const opts = { toJSON : {virtuals:true}};

const RestaurantSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required:true
        }
    },
    price:String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    category: [
        {
            type: Schema.Types.ObjectId,
            type: Schema.Types.String,
            ref: 'category'
        }
    ]
},opts);


RestaurantSchema.virtual('properties.popUpMarkup').get(function (){
    return `<a href="/restaurants/${this._id}">${this.title}</a>`

});

RestaurantSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

RestaurantSchema.plugin(mongoosePaginate);
 
module.exports = mongoose.model('Restaurant', RestaurantSchema);
