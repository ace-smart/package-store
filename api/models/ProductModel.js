const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        name: {
            type: String,
            required: true,
            unique: true,
            text: true,
        },
        details: {
            size: {type: String},
            color: {name: String, hexCode: String},
            tags: [String],
            description: {type: String},
            madeIn: {type: String},
            weight: {value: Number, unit: String},
        },
        price: {
            value: Number,
            currency: String
        },
        status: {
            type: String,
            default: "deactivated",
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Product", ProductSchema)
