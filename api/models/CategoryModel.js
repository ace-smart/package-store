const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 4,
      max: 50,
      required: true,
      unique: true,
      text: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        default: null,
      },
    ],
    status: {
      type: String,
      default: "deactivated",
    },
  },
  {
    // options
    timestamps: true,
  }
)

module.exports = mongoose.model("Category", CategorySchema)
