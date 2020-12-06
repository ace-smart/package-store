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
    // required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  clientId: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    default: null
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  addressId:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
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
  confirmString: {
    type: String,
    default: require('crypto').randomBytes(64).toString('hex')
  },
  status: {
    type: String,
    default: 'deactivated',
  },
},{
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
