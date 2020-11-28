const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        subcategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
        },
        name: {
            type: String,
            required: true,
            unique: true,
            text: true,
        },
        details: {
            size: {type: String},
            color: {colorName: String, hexCode: String},
            material: {type: String},
            gender: {type: String},
            season: {type: String}
        },
        price: {
            type: Number
        },
        status: {
            type: String,
            default: "deactivated",
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Product", ProductSchema)
