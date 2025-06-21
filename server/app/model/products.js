const mongoose = require('mongoose')
const Joi = require('joi')

const schema = mongoose.Schema

const productValidation = Joi.object({
    productName: Joi.string().required().min(3),
    productPrice: Joi.string().required().min(2),
    productDesc: Joi.string().required().min(10),
    productColor: Joi.array().items(Joi.string()),
    productSize: Joi.array().items(Joi.string()),
    brandName: Joi.string().required().min(3),
    image: Joi.string().required()
})


//note for object
// Joi.array().items(Joi.object({
//     // Object schema
// }))

const ProductSchema = new schema({
    productName: {
        type: String,
        require: true,
        maxlength: 40,
        minlength: 3
    },

    productPrice: {
        type: String,
        require: true,
        maxlength: 40,
        minlength: 3
    },
    productDesc: {
        type: String,
        require: true,
        maxlength: 500,
        minlength: 10
    },
    productColor: {
        type: [],
        require: true
    },
    productSize: {
        type: [],
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },
    brandName: {
        type: String,
        require: true,
        maxlength: 40,
        minlength: 3
    },
    image: {
        type: String,
        require: true
    },

    deleted: {
        type: Boolean,
        default: false
    },


    deletedAt: {
        type: Date  ,
        default:null
    }
},{timestamps:true})

const ProductModel = mongoose.model('productsEjs', ProductSchema)
module.exports = { ProductModel, productValidation }