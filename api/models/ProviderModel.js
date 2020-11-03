const mongoose = require("mongoose")

const ProviderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            text: true,
            mind: 4,
            max: 255
        },
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address',
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            max: 300,
        },
        status: {
            type: String,
            default: "deactivated",
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Provider", ProviderSchema)
