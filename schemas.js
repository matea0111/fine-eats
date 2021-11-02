const { allow } = require('joi');
const Joi=require('joi');


module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        title: Joi.string().trim().min(1).required(),
        location: Joi.string().trim().min(1).required(),
        category: Joi.any().allow(),
        price: Joi.string().required().min(1),
        //image: Joi.string().required(),
        description: Joi.string().allow(''),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

