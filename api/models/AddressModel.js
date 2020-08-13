const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
            required: true,
        },
        district: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String,
            required: true,
        },
        postalCode: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "deactivated",
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Address", AddressSchema)
