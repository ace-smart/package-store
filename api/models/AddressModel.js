const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
        },
        district: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        },
        postalCode: {
            type: Number,
        },
        status: {
            type: String,
            default: "deactivated",
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Address", AddressSchema)
