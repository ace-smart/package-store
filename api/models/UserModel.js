const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    min: 5,
    max: 255,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    max: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
  },
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  refresh_secret: {
    type: String,
    default: require('crypto').randomBytes(12).toString('hex')
  },
  status: {
    type: String,
    default: 'deactivated',
  },
},{
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
