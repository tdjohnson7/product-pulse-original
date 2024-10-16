const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productTitle: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        require: true,
    },
    productDescription: {
        type: String,
        require: true,
    },
    cloudinaryId: {
        type: String,
        require: true
    },
    productRating: {
        type: Number
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company1",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Product", ProductSchema)