const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {
  jwtSecret,
  jwtExpirationInterval
} = require('../../config/environment-variables');

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true
    },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
  },
  {
    timestamps: true
  }
);

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, name: this.name }, jwtSecret, {
    expiresIn: jwtExpirationInterval
  });
  return token;
};
module.exports = mongoose.model('User', userSchema);
