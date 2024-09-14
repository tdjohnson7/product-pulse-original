const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        require: true,
    },
    caption: {
        type: String,
        require: true,
    },
    cloudinaryId: {
        type: String,
        require: true
    },
    rating: {
        type: Number
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Product", ProductSchema)