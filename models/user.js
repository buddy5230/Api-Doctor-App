const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    role: {
      type: String,
      default: 'User',
    },
  },
  { versionKey: false, collection: 'users' }
);

module.exports = mongoose.model('users', userSchema);
